import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
// import { RegisteredNewProductDomainEvent } from '../../domain/events/publishers';
import { ISellerSaleDomainDto } from '@domain-dtos';
import { IProductDomainService } from '@domain-services';

export class RegisterSellerSaleUseCase {
  constructor(
    private readonly product$: IProductDomainService, // private readonly registeredNewProductDomainEvent: RegisteredNewProductDomainEvent,
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
              // this.registeredNewProductDomainEvent.publish(product);
            }),
          ),
        );
      }),
    );
  }
}
