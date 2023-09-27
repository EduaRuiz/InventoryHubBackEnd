import { ProductDomainModel } from '@domain-models';
import { Observable, switchMap, tap } from 'rxjs';
// import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { IAddProductDomainDto } from '@domain-dtos';
import { IProductDomainService } from '@domain-services';

export class RegisterProductQuantityUseCase {
  constructor(
    private readonly product$: IProductDomainService, // private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(addProductDto: IAddProductDomainDto): Observable<ProductDomainModel> {
    return this.product$.getProduct(addProductDto.id).pipe(
      switchMap((product: ProductDomainModel) => {
        product.quantity = product.quantity.valueOf() + addProductDto.quantity;
        return this.product$.updateProduct(product).pipe(
          tap((product: ProductDomainModel) => {
            console.log('Product created: ', product);
            // this.registeredNewProductDomainEvent.publish(product);
          }),
        );
      }),
    );
  }
}
