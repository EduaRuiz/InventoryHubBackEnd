import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable, throwError } from 'rxjs';

export class ProductRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  constructor(private readonly product$: IProductDomainService) {}
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    const productRegistered = command.eventBody as ProductDomainModel;
    const newProduct = this.entityFactory(productRegistered);
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
    productRegistered: ProductDomainModel,
  ): ProductDomainModel {
    const productData = new ProductDomainModel(
      productRegistered.name,
      productRegistered.description,
      productRegistered.price,
      productRegistered.quantity,
      productRegistered.category,
      productRegistered.branchId,
      productRegistered.id,
    );
    return productData;
  }
}
