import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class SellerSaleRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  constructor(private readonly product$: IProductDomainService) {}
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    const productSold = command.eventBody as ProductDomainModel;
    const newProduct = this.entityFactory(productSold);
    return this.product$.createProduct(newProduct);
  }

  private entityFactory(productSold: ProductDomainModel): ProductDomainModel {
    const productData = new ProductDomainModel(
      productSold.name,
      productSold.description,
      productSold.price,
      productSold.quantity,
      productSold.category,
      productSold.branchId,
      productSold.id,
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
