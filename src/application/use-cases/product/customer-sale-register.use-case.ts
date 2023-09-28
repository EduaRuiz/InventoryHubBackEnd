import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ICustomerSaleDomainCommand } from 'src/domain/commands';
import { IProductDomainService } from '@domain-services';
import { CustomerSaleRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class CustomerSaleRegisterUseCase
  implements IUseCase<ICustomerSaleDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly customerSaleRegisteredEventPublisher: CustomerSaleRegisteredEventPublisher,
  ) {}

  execute(
    customerSaleCommand: ICustomerSaleDomainCommand,
  ): Observable<ProductDomainModel> {
    return this.product$.getProduct(customerSaleCommand.productId).pipe(
      switchMap((product: ProductDomainModel) => {
        const productData = this.entityFactory(product, customerSaleCommand);
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
              this.eventHandler(product);
            }),
          ),
        );
      }),
    );
  }

  private entityFactory(
    product: ProductDomainModel,
    customerSaleCommand: ICustomerSaleDomainCommand,
  ): ProductDomainModel {
    product.quantity =
      product.quantity.valueOf() - customerSaleCommand.quantity;
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

  private eventHandler(product: ProductDomainModel): void {
    console.log('Customer sale: ', product);
    this.customerSaleRegisteredEventPublisher.response = product;
    this.customerSaleRegisteredEventPublisher.publish();
  }
}
