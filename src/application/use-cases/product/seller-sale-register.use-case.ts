import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ISellerSaleDomainCommand } from 'src/domain/commands';
import { IProductDomainService } from '@domain-services';
import { SellerSaleRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class SellerSaleRegisterUseCase
  implements IUseCase<ISellerSaleDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly sellerSaleRegisteredEventPublisher: SellerSaleRegisteredEventPublisher,
  ) {}

  execute(
    sellerSaleCommand: ISellerSaleDomainCommand,
  ): Observable<ProductDomainModel> {
    return this.product$.getProduct(sellerSaleCommand.productId).pipe(
      switchMap((product: ProductDomainModel) => {
        const productData = this.entityFactory(product, sellerSaleCommand);
        if (productData.hasErrors()) {
          throw new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            productData.getErrors(),
          );
        }
        return iif(
          () => productData.quantity.valueOf() < 0,
          throwError(() => new ConflictException('Product out of stock')),
          this.product$.updateProduct(productData).pipe(
            tap((product: ProductDomainModel) => {
              this.eventHandler(product, sellerSaleCommand.discount);
            }),
          ),
        );
      }),
    );
  }

  private entityFactory(
    product: ProductDomainModel,
    sellerSaleCommand: ISellerSaleDomainCommand,
  ): ProductDomainModel {
    product.quantity = product.quantity.valueOf() - sellerSaleCommand.quantity;
    const branchData = new ProductDomainModel(
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.category,
      product.branchId,
      product.id,
    );
    branchData;
    return branchData;
  }

  private eventHandler(product: ProductDomainModel, discount: number): void {
    console.log('Seller sale: ', product);
    product.price = product.price.valueOf() * discount;
    this.sellerSaleRegisteredEventPublisher.response = product;
    this.sellerSaleRegisteredEventPublisher.publish();
  }
}
