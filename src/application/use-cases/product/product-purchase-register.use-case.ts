import { ProductDomainModel } from '@domain-models';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductPurchaseRegisteredEventPublisher } from '@domain-publishers';
import { IAddProductDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductIdValueObject,
  ProductQuantityValueObject,
} from '@value-objects/product';
import { ValueObjectException } from '@sofka/exceptions';

export class ProductPurchaseRegisterUseCase extends ValueObjectErrorHandler {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly registeredProductPurchaseEvent: ProductPurchaseRegisteredEventPublisher,
  ) {
    super();
  }

  execute(addProductDto: IAddProductDomainDto): Observable<ProductDomainModel> {
    return this.product$.getProduct(addProductDto.id).pipe(
      switchMap((product: ProductDomainModel) => {
        product.quantity = product.quantity.valueOf() + addProductDto.quantity;
        return this.product$.updateProduct(product).pipe(
          tap((product: ProductDomainModel) => {
            this.eventHandler(product);
          }),
        );
      }),
    );
  }

  private createValueObjects(
    command: IAddProductDomainDto,
  ): ValueObjectBase<any>[] {
    const id = new ProductIdValueObject(command.id);
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

  private eventHandler(product: ProductDomainModel): void {
    console.log('Product created: ', product);
    this.registeredProductPurchaseEvent.response = product;
    this.registeredProductPurchaseEvent.publish();
    this.storedEvent$.createStoredEvent({
      aggregateRootId: product?.id?.valueOf() ?? 'null',
      eventBody: JSON.stringify(product),
      occurredOn: new Date(),
      typeName: 'ProductPurchaseRegistered',
    });
  }
}
