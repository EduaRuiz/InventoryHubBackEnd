import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { Observable, of, switchMap } from 'rxjs';
import { DomainEventPublisher } from '@domain-publishers';
import { INewProductDomainCommand } from '@domain-commands';
import { IStoreEventDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';

export class ProductRegisterUseCase
  implements IUseCase<INewProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly storeEvent$: IStoreEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    newProductCommand: INewProductDomainCommand,
  ): Observable<ProductDomainModel> {
    const newProduct = this.entityFactory(newProductCommand);
    const event = this.eventFactory(newProduct);
    return this.storeEvent$
      .getEventByAggregateRootId(newProductCommand.branchId)
      .pipe(
        switchMap(() => {
          return this.storeEvent$.storeEvent(event).pipe(
            switchMap((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return of(newProduct);
            }),
          );
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
    if (productData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        productData.getErrors(),
      );
    }
    return productData;
  }

  private eventFactory(productData: ProductDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      productData.branchId,
      JSON.stringify(productData),
      new Date(),
      TypeNameEnum.PRODUCT_REGISTERED,
    );
    return event;
  }
}
