import { ProductDomainModel } from '@domain-models';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductPurchaseRegisteredEventPublisher } from '@domain-publishers';
import { IAddProductDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';

export class ProductPurchaseRegisterUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly registeredProductPurchaseEvent: ProductPurchaseRegisteredEventPublisher,
  ) {}

  execute(addProductDto: IAddProductDomainDto): Observable<ProductDomainModel> {
    return this.product$.getProduct(addProductDto.id).pipe(
      switchMap((product: ProductDomainModel) => {
        product.quantity = product.quantity.valueOf() + addProductDto.quantity;
        return this.product$.updateProduct(product).pipe(
          tap((product: ProductDomainModel) => {
            console.log('Product created: ', product);
            this.registeredProductPurchaseEvent.response = product;
            this.registeredProductPurchaseEvent.publish();
            this.storedEvent$.createStoredEvent({
              aggregateRootId: product?.id?.valueOf() ?? 'null',
              eventBody: JSON.stringify(product),
              occurredOn: new Date(),
              typeName: 'ProductRegistered',
            });
          }),
        );
      }),
    );
  }
}
