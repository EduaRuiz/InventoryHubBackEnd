import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class ProductUpdatedUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  constructor(private readonly product$: IProductDomainService) {}
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    const productUpdated = command.eventBody as ProductDomainModel;
    const newProduct = this.entityFactory(productUpdated);
    return this.product$.createProduct(newProduct);
  }

  private entityFactory(
    productUpdated: ProductDomainModel,
  ): ProductDomainModel {
    const productData = new ProductDomainModel(
      productUpdated.name,
      productUpdated.description,
      productUpdated.price,
      productUpdated.quantity,
      productUpdated.category,
      productUpdated.branchId,
      productUpdated.id,
    );
    if (productData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        productData.getErrors(),
      );
    }
    return productData;
  }
}
