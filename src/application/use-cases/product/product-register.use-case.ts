import { ProductDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { ProductRegisteredEventPublisher } from '@domain-publishers';
import { INewProductDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';

export class ProductRegisterUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly productRegisteredDomainEvent: ProductRegisteredEventPublisher,
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
        this.productRegisteredDomainEvent.response = product;
        this.storedEvent$.createStoredEvent({
          aggregateRootId: registerProductDto.branchId,
          eventBody: JSON.stringify(product),
          occurredOn: new Date(),
          typeName: 'ProductRegistered',
        });
        // this.productRegisteredDomainEvent.emit();
        this.productRegisteredDomainEvent.publish();
      }),
    );
  }
}
