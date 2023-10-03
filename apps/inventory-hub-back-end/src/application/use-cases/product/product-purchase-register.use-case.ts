import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { Observable, of, switchMap } from 'rxjs';
import { DomainEventPublisher } from '@domain-publishers';
import { IAddProductDomainCommand } from '@domain-commands';
import { IStoreEventDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

export class ProductPurchaseRegisterUseCase
  implements IUseCase<IAddProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly storeEvent$: IStoreEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    addProductCommand: IAddProductDomainCommand,
  ): Observable<ProductDomainModel> {
    return this.storeEvent$
      .getLastEventByIdEventBody(addProductCommand.id)
      .pipe(
        switchMap((event: EventDomainModel) => {
          const product = JSON.parse(event.eventBody);
          if (product?.price === undefined) {
            throw new ConflictException(
              'El producto con el id ingresado no existe',
            );
          }
          const newProduct = this.entityFactory(product, addProductCommand);
          const eventData = this.eventFactory(newProduct);
          return this.storeEvent$.storeEventUpdate(eventData).pipe(
            switchMap((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return of(JSON.parse(event.eventBody));
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
      JSON.stringify(product),
      new Date(),
      TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
    );
  }
}
