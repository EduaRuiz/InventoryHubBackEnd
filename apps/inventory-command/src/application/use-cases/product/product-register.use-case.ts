import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { DomainEventPublisher } from '@domain-publishers';
import { INewProductDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

export class ProductRegisterUseCase
  implements IUseCase<INewProductDomainCommand, ProductDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    newProductCommand: INewProductDomainCommand,
  ): Observable<ProductDomainModel> {
    const newProduct = this.entityFactory(newProductCommand);
    if (newProduct.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newProduct.getErrors(),
          ),
      );
    }
    const newEvent = this.eventFactory(newProduct);
    return this.event$
      .entityAlreadyExist(
        'name',
        newProduct.name,
        [TypeNameEnum.PRODUCT_REGISTERED],
        newProduct.branchId,
      )
      .pipe(
        switchMap((exist: boolean) => {
          if (exist)
            throw new ConflictException(
              'El nombre ya existe en la sucursal actual',
            );
          return this.event$
            .getLastEventByEntityId(newProduct.branchId, [
              TypeNameEnum.BRANCH_REGISTERED,
            ])
            .pipe(
              switchMap(() => {
                return this.event$.storeEvent(newEvent).pipe(
                  map((event: EventDomainModel) => {
                    this.eventPublisher.response = event;
                    this.eventPublisher.publish();
                    return newProduct;
                  }),
                );
              }),
              catchError(() => {
                throw new ConflictException('La sucursal no existe');
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
    return productData;
  }

  private eventFactory(product: ProductDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      product.branchId,
      product,
      new Date(),
      TypeNameEnum.PRODUCT_REGISTERED,
    );
    return event;
  }
}
