import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ISellerSaleDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';
import { SellerSaleRegisteredEventPublisher } from '../../../domain/events/publishers/seller-sale-registered.event-publisher';

export class SellerSaleRegisterUseCase {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly sellerSaleRegisteredEventPublisher: SellerSaleRegisteredEventPublisher,
  ) {}

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
              console.log('Seller sale: ', product);
              this.sellerSaleRegisteredEventPublisher.response = product;
              this.sellerSaleRegisteredEventPublisher.publish();
              this.storedEvent$.createStoredEvent({
                aggregateRootId: product?.id?.valueOf() ?? 'null',
                eventBody: JSON.stringify(product),
                occurredOn: new Date(),
                typeName: 'ProductRegistered',
              });
            }),
          ),
        );
      }),
    );
  }
}
