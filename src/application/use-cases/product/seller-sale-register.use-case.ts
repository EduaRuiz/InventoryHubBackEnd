import { ProductDomainModel } from '@domain-models';
import { ConflictException } from '@nestjs/common';
import { Observable, iif, switchMap, tap, throwError } from 'rxjs';
import { ISellerSaleDomainDto } from '@domain-dtos';
import { IProductDomainService } from '@domain-services';
import { SellerSaleRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductIdValueObject,
  ProductQuantityValueObject,
} from '@value-objects/product';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class SellerSaleRegisterUseCase
  extends ValueObjectErrorHandler
  implements IUseCase<ISellerSaleDomainDto, ProductDomainModel>
{
  constructor(
    private readonly product$: IProductDomainService,
    private readonly sellerSaleRegisteredEventPublisher: SellerSaleRegisteredEventPublisher,
  ) {
    super();
  }

  execute(
    customerSaleDto: ISellerSaleDomainDto,
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
              this.eventHandler(product, customerSaleDto.discount);
            }),
          ),
        );
      }),
    );
  }

  private createValueObjects(
    command: ISellerSaleDomainDto,
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

  private eventHandler(product: ProductDomainModel, discount: number): void {
    console.log('Seller sale: ', product);
    product.price = product.price.valueOf() * discount;
    this.sellerSaleRegisteredEventPublisher.response = product;
    this.sellerSaleRegisteredEventPublisher.publish();
  }
}
