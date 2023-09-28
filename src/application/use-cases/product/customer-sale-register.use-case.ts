import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ICustomerSaleDomainDto } from '@domain-dtos';
import { IProductDomainService } from '@domain-services';
import { CustomerSaleRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductIdValueObject,
  ProductQuantityValueObject,
} from '@value-objects/product';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class CustomerSaleRegisterUseCase
  extends ValueObjectErrorHandler
  implements IUseCase<ICustomerSaleDomainDto, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly customerSaleRegisteredEventPublisher: CustomerSaleRegisteredEventPublisher,
  ) {
    super();
  }

  execute(
    customerSaleDto: ICustomerSaleDomainDto,
  ): Observable<ProductDomainModel> {
    const valueObjects = this.createValueObjects(customerSaleDto);
    this.validateValueObjects(valueObjects);
    return this.product$.getProduct(customerSaleDto.productId).pipe(
      switchMap((product: ProductDomainModel) => {
        product.quantity =
          product.quantity.valueOf() - customerSaleDto.quantity;
        return iif(
          () => product.quantity.valueOf() < 0,
          throwError(() => new ConflictException('Product out of stock')),
          this.product$.updateProduct(product).pipe(
            tap((product: ProductDomainModel) => {
              this.eventHandler(product);
            }),
          ),
        );
      }),
    );
  }

  private createValueObjects(
    command: ICustomerSaleDomainDto,
  ): ValueObjectBase<any>[] {
    const id = new ProductIdValueObject(command.productId);
    const quantity = new ProductQuantityValueObject(command.quantity);
    return [id, quantity];
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    this.cleanErrors();
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

  private eventHandler(product: ProductDomainModel): void {
    console.log('Customer sale: ', product);
    this.customerSaleRegisteredEventPublisher.response = product;
    this.customerSaleRegisteredEventPublisher.publish();
  }
}
