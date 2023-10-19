import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable, throwError } from 'rxjs';

export class ProductPurchaseRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  constructor(private readonly product$: IProductDomainService) {}
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    const productPurchased = command.eventBody as ProductDomainModel;
    const newProduct = this.entityFactory(productPurchased);
    if (newProduct.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newProduct.getErrors(),
          ),
      );
    }
    return this.product$.createProduct(newProduct);
  }

  private entityFactory(
    productPurchased: ProductDomainModel,
  ): ProductDomainModel {
    const productData = new ProductDomainModel(
      productPurchased.name,
      productPurchased.description,
      productPurchased.price,
      productPurchased.quantity,
      productPurchased.category,
      productPurchased.branchId,
      productPurchased.id,
    );
    return productData;
  }
}
