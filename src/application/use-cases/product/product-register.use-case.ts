import { ProductDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { ProductRegisteredEventPublisher } from '@domain-publishers';
import { INewProductDomainDto } from '@domain-dtos';
import {
  IProductDomainService,
  IStoredEventDomainService,
} from '@domain-services';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductBranchIdValueObject,
  ProductCategoryValueObject,
  ProductDescriptionValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { ValueObjectException } from '@sofka/exceptions';

export class ProductRegisterUseCase extends ValueObjectErrorHandler {
  constructor(
    private readonly product$: IProductDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly productRegisteredDomainEvent: ProductRegisteredEventPublisher,
  ) {
    super();
  }

  execute(
    registerProductDto: INewProductDomainDto,
  ): Observable<ProductDomainModel> {
    registerProductDto.name = registerProductDto.name?.trim().toUpperCase();
    registerProductDto.description = registerProductDto.description.trim();
    const newProduct = this.entityFactory(registerProductDto);
    return this.product$.createProduct(newProduct).pipe(
      tap((product: ProductDomainModel) => {
        this.eventHandler(product);
      }),
    );
  }

  private createValueObjects(
    command: INewProductDomainDto,
  ): ValueObjectBase<any>[] {
    const branchId = new ProductBranchIdValueObject(command.branchId);
    const name = new ProductNameValueObject(command.name);
    const price = new ProductPriceValueObject(command.price);
    const description = new ProductDescriptionValueObject(command.description);
    const category = new ProductCategoryValueObject(command.category);
    return [name, price, description, category, branchId];
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
    if (this.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        this.getErrors(),
      );
    }
  }

  private entityFactory(
    registerProductDto: INewProductDomainDto,
  ): ProductDomainModel {
    this.validateValueObjects(this.createValueObjects(registerProductDto));
    return {
      ...registerProductDto,
      quantity: 0,
    };
  }

  private eventHandler(product: ProductDomainModel): void {
    console.log('Product created: ', product);
    this.productRegisteredDomainEvent.response = product;
    this.productRegisteredDomainEvent.publish();
    this.storedEvent$.createStoredEvent({
      aggregateRootId: product?.branchId ?? 'null',
      eventBody: JSON.stringify(product),
      occurredOn: new Date(),
      typeName: 'ProductRegistered',
    });
  }
}
