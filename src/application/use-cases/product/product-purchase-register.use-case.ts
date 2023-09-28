import { ProductDomainModel } from '@domain-models';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductPurchaseRegisteredEventPublisher } from '@domain-publishers';
import { IAddProductDomainCommand } from 'src/domain/commands';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class ProductPurchaseRegisterUseCase
  implements IUseCase<IAddProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly registeredProductPurchaseEvent: ProductPurchaseRegisteredEventPublisher,
  ) {}

  execute(
    addProductCommand: IAddProductDomainCommand,
  ): Observable<ProductDomainModel> {
    return this.product$.getProduct(addProductCommand.id).pipe(
      switchMap((product: ProductDomainModel) => {
        const productData = this.entityFactory(product, addProductCommand);
        if (productData.hasErrors()) {
          throw new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            productData.getErrors(),
          );
        }
        return this.product$.updateProduct(productData).pipe(
          tap((product: ProductDomainModel) => {
            this.eventHandler(product);
          }),
        );
      }),
    );
  }

  private entityFactory(
    product: ProductDomainModel,
    addProductCommand: IAddProductDomainCommand,
  ): ProductDomainModel {
    product.quantity = product.quantity.valueOf() + addProductCommand.quantity;
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
    console.log('Product created: ', product);
    this.registeredProductPurchaseEvent.response = product;
    this.registeredProductPurchaseEvent.publish();
  }
}
