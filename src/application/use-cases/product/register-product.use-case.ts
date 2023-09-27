import { ProductDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
// import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { INewProductDomainDto } from '@domain-dtos';
import { IProductDomainService } from '@domain-services';

export class RegisterProductUseCase {
  constructor(
    private readonly product$: IProductDomainService, // private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
  ) {}

  execute(
    registerProductDto: INewProductDomainDto,
  ): Observable<ProductDomainModel> {
    registerProductDto.name = registerProductDto.name?.trim().toUpperCase();
    registerProductDto.description = registerProductDto.description.trim();
    const newProduct = {
      ...registerProductDto,
      quantity: 0,
    };
    return this.product$.createProduct(newProduct).pipe(
      tap((product: ProductDomainModel) => {
        console.log('Product created: ', product);
        // this.registeredNewProductDomainEvent.publish(product);
      }),
    );
  }
}
