import {
  EventDomainModel,
  ProductDomainModel,
  SaleDomainModel,
} from '@domain-models';
import { ConflictException } from '@nestjs/common';
import {
  Observable,
  concat,
  concatMap,
  forkJoin,
  from,
  map,
  mergeMap,
  of,
  switchMap,
  toArray,
} from 'rxjs';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { SaleTypeEnum, TypeNameEnum } from '@enums';
import { catchError } from 'rxjs';
import { ICustomerSaleDomainCommand } from '@domain-commands/index';

export class CustomerSaleRegisterUseCase
  implements IUseCase<ICustomerSaleDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    customerSaleCommand: ICustomerSaleDomainCommand,
  ): Observable<ProductDomainModel> {
    return this.event$
      .getLastEventByEntityId(customerSaleCommand.userId, [
        TypeNameEnum.USER_REGISTERED,
      ])
      .pipe(
        catchError(() => {
          throw new ConflictException(
            'El usuario no existe o no se encuentra registrado',
          );
        }),
        switchMap((event: EventDomainModel) => {
          if (event.aggregateRootId !== customerSaleCommand.branchId) {
            throw new ConflictException(
              'El usuario no pertenece a la sucursal seleccionada',
            );
          }
          return this.sale(customerSaleCommand);
        }),
      );
  }

  private sale(
    customerSaleCommand: ICustomerSaleDomainCommand,
  ): Observable<ProductDomainModel> {
    const products$ = this.getProducts(customerSaleCommand);
    const events$ = this.factoryEvents(products$);
    const eventsStored$ = this.storeEvents(events$);
    const productsInSale$ = this.productsInSale(products$, customerSaleCommand);
    const sale$ = this.saleFactory(
      productsInSale$,
      customerSaleCommand.branchId,
      customerSaleCommand.userId,
    );
    return this.saleEventFactory(sale$).pipe(
      switchMap((event: EventDomainModel) => {
        return this.publishEvents(eventsStored$).pipe(
          switchMap(() => {
            return this.event$.storeEvent(event).pipe(
              switchMap((event: EventDomainModel) => {
                this.eventPublisher.response = event;
                this.eventPublisher.publish();
                return of(event.eventBody as ProductDomainModel);
              }),
            );
          }),
        );
      }),
    );
  }

  private productFactory(
    product: ProductDomainModel,
    quantity: number,
  ): ProductDomainModel {
    product.quantity = product.quantity?.valueOf() - quantity;
    const productData = new ProductDomainModel(
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.category,
      product.branchId,
      product.id,
    );

    if (productData.quantity?.valueOf() < 0) {
      throw new ConflictException(
        'No hay suficientes productos para realizar la venta',
      );
    }

    if (productData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        productData.getErrors(),
      );
    }

    return productData;
  }

  private saleFactory(
    products: Observable<ProductDomainModel[]>,
    branchId: string,
    userId: string,
  ): Observable<SaleDomainModel> {
    return products.pipe(
      switchMap((productArray) => {
        const total = productArray.reduce(
          (acc, product) => acc + product.price * product.quantity,
          0,
        );
        const saleItems = productArray.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        }));
        return this.event$
          .generateIncrementalSaleId(branchId, [
            TypeNameEnum.CUSTOMER_SALE_REGISTERED,
            TypeNameEnum.SELLER_SALE_REGISTERED,
          ])
          .pipe(
            map((numberId: number) => {
              return new SaleDomainModel(
                numberId,
                saleItems,
                new Date(),
                SaleTypeEnum.CUSTOMER_SALE,
                total,
                branchId,
                userId,
              );
            }),
          );
      }),
    );
  }

  private productEventFactory(product: ProductDomainModel): EventDomainModel {
    return new EventDomainModel(
      product.branchId,
      product,
      new Date(),
      TypeNameEnum.PRODUCT_UPDATED,
    );
  }

  private saleEventFactory(
    saleObservable: Observable<SaleDomainModel>,
  ): Observable<EventDomainModel> {
    return saleObservable.pipe(
      map((sale: SaleDomainModel) => {
        return new EventDomainModel(
          sale.branchId,
          sale,
          new Date(),
          TypeNameEnum.CUSTOMER_SALE_REGISTERED,
        );
      }),
    );
  }

  private getProducts(
    sale: ICustomerSaleDomainCommand,
  ): Observable<ProductDomainModel[]> {
    const observables$ = sale.products.map(({ productId, quantity }) => {
      return this.event$
        .getLastEventByEntityId(
          productId,
          [
            TypeNameEnum.PRODUCT_REGISTERED,
            TypeNameEnum.PRODUCT_UPDATED,
            TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
          ],
          sale.branchId,
        )
        .pipe(
          mergeMap((event: EventDomainModel) => {
            return of({
              product: event.eventBody as ProductDomainModel,
              quantity,
            });
          }),
        );
    });

    return forkJoin(observables$).pipe(
      map((productsWithQuantity) => {
        return productsWithQuantity.map((item) =>
          this.productFactory(item.product, item.quantity),
        );
      }),
    );
  }

  private factoryEvents(
    products: Observable<ProductDomainModel[]>,
  ): Observable<EventDomainModel[]> {
    return products.pipe(
      map((productArray: ProductDomainModel[]) => {
        return productArray.map((product) => this.productEventFactory(product));
      }),
    );
  }

  private storeEvents(
    events: Observable<EventDomainModel[]>,
  ): Observable<EventDomainModel[]> {
    return events.pipe(
      mergeMap((eventArray) => from(eventArray)),
      mergeMap((event) => this.event$.storeEvent(event)),
      toArray(),
    );
  }

  private publishEvents(
    events: Observable<EventDomainModel[]>,
  ): Observable<void> {
    return events.pipe(
      concatMap((eventArray) => {
        const publishObservables$ = eventArray.map((event) => {
          this.eventPublisher.response = event;
          return from(this.eventPublisher.publish());
        });
        return concat(...publishObservables$);
      }),
    );
  }

  private productsInSale(
    products: Observable<ProductDomainModel[]>,
    p: ICustomerSaleDomainCommand,
  ): Observable<ProductDomainModel[]> {
    return products.pipe(
      map((productArray) => {
        return productArray.map((product) => {
          const commandProduct = p.products.find(
            (commandProd) => commandProd.productId === product.id,
          );
          if (commandProduct) {
            product.quantity = commandProduct.quantity;
          }
          return product;
        });
      }),
    );
  }
}
