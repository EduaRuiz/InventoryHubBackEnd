import { ProductDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { ProductRegisteredEventPublisher } from '@domain-publishers';
import { INewProductDomainCommand } from 'src/domain/commands';
import { IProductDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class ProductRegisterUseCase
  implements IUseCase<INewProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly productRegisteredDomainEvent: ProductRegisteredEventPublisher,
  ) {}

  execute(
    newProductCommand: INewProductDomainCommand,
  ): Observable<ProductDomainModel> {
    const newProduct = this.entityFactory(newProductCommand);
    if (newProduct.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        newProduct.getErrors(),
      );
    }
    return this.product$.createProduct(newProduct).pipe(
      tap((product: ProductDomainModel) => {
        this.eventHandler(product);
      }),
    );
  }

  private entityFactory(
    newProductCommand: INewProductDomainCommand,
  ): ProductDomainModel {
    const productData = new ProductDomainModel(
      newProductCommand.name,
      newProductCommand.description,
      newProductCommand.price,
      0,
      newProductCommand.category,
      newProductCommand.branchId,
    );
    return productData;
  }

  private eventHandler(product: ProductDomainModel): void {
    console.log('Product created: ', product);
    this.productRegisteredDomainEvent.response = product;
    this.productRegisteredDomainEvent.publish();
  }
}
