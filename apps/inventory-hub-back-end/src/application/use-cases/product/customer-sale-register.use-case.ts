import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, of, switchMap } from 'rxjs';
import { ICustomerSaleDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';

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
      .getLastEventByEntityId(customerSaleCommand.productId, [
        TypeNameEnum.PRODUCT_REGISTERED,
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.SELLER_SALE_REGISTERED,
        TypeNameEnum.CUSTOMER_SALE_REGISTERED,
      ])
      .pipe(
        switchMap((event: EventDomainModel) => {
          const product = event.eventBody as ProductDomainModel;
          if (product?.price === undefined) {
            throw new ConflictException(
              'El producto con el id ingresado no existe',
            );
          }
          const newProduct = this.entityFactory(product, customerSaleCommand);
          const eventData = this.eventFactory(newProduct);
          return this.event$.storeEvent(eventData).pipe(
            switchMap((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return of(event.eventBody as ProductDomainModel);
            }),
          );
        }),
      );
  }

  private entityFactory(
    product: ProductDomainModel,
    customerSaleCommand: ICustomerSaleDomainCommand,
  ): ProductDomainModel {
    product.quantity =
      product.quantity?.valueOf() - customerSaleCommand.quantity;
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

  private eventFactory(product: ProductDomainModel): EventDomainModel {
    return new EventDomainModel(
      product.branchId,
      product,
      new Date(),
      TypeNameEnum.CUSTOMER_SALE_REGISTERED,
    );
  }
}
