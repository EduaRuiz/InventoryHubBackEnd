import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { Observable, map, switchMap } from 'rxjs';
import { DomainEventPublisher } from '@domain-publishers';
import { IAddProductDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';

export class ProductPurchaseRegisterUseCase
  implements IUseCase<IAddProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    addProductCommand: IAddProductDomainCommand,
    productId: string,
  ): Observable<ProductDomainModel> {
    return this.event$
      .getLastEventByEntityId(productId, [
        TypeNameEnum.PRODUCT_REGISTERED,
        TypeNameEnum.PRODUCT_UPDATED,
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
      ])
      .pipe(
        switchMap((event: EventDomainModel) => {
          const newProduct = this.entityFactory(
            event.eventBody as ProductDomainModel,
            addProductCommand,
          );
          const eventData = this.eventFactory(newProduct);
          return this.event$.storeEvent(eventData).pipe(
            map((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return event.eventBody as ProductDomainModel;
            }),
          );
        }),
      );
  }

  private entityFactory(
    product: ProductDomainModel,
    addProductCommand: IAddProductDomainCommand,
  ): ProductDomainModel {
    product.quantity = product.quantity?.valueOf() + addProductCommand.quantity;
    const productData = new ProductDomainModel(
      product.name,
      product.description,
      product.price,
      product.quantity,
      product.category,
      product.branchId,
      product.id,
    );
    if (productData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        productData.getErrors(),
      );
    }
    return productData;
  }

  private eventFactory(product: ProductDomainModel): EventDomainModel {
    return new EventDomainModel(
      product.branchId,
      product,
      new Date(),
      TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
    );
  }
}
