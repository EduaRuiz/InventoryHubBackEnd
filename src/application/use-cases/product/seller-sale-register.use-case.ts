import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ISellerSaleDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';
import { SellerSaleRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductIdValueObject,
  ProductQuantityValueObject,
} from '@value-objects/product';
import { ValueObjectException } from '@sofka/exceptions';

export class SellerSaleRegisterUseCase extends ValueObjectErrorHandler {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly sellerSaleRegisteredEventPublisher: SellerSaleRegisteredEventPublisher,
  ) {
    super();
  }

  execute(
    customerSaleDto: ISellerSaleDomainDto,
  ): Observable<ProductDomainModel> {
    return this.product$.getProduct(customerSaleDto.productId).pipe(
      switchMap((product: ProductDomainModel) => {
        product.quantity =
          product.quantity.valueOf() - customerSaleDto.quantity;
        return iif(
          () => product.quantity.valueOf() < 0,
          throwError(() => new ConflictException('Product out of stock')),
          this.product$.updateProduct(product).pipe(
            tap((product: ProductDomainModel) => {
              this.eventHandler(product, customerSaleDto.discount);
            }),
          ),
        );
      }),
    );
  }

  private createValueObjects(
    command: ISellerSaleDomainDto,
  ): ValueObjectBase<any>[] {
    const id = new ProductIdValueObject(command.productId);
    const quantity = new ProductQuantityValueObject(command.quantity);
    return [id, quantity];
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
    if (this.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        this.getErrors(),
      );
    }
  }

  private eventHandler(product: ProductDomainModel, discount: number): void {
    console.log('Seller sale: ', product);
    product.price = product.price.valueOf() * discount;
    this.sellerSaleRegisteredEventPublisher.response = product;
    this.sellerSaleRegisteredEventPublisher.publish();
    this.storedEvent$.createStoredEvent({
      aggregateRootId: product?.id?.valueOf() ?? 'null',
      eventBody: JSON.stringify(product),
      occurredOn: new Date(),
      typeName: 'SellerSaleRegistered',
    });
  }
}
