import { EntityBase, ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import {
  SaleIdValueObject,
  SaleNumberValueObject,
  SaleProductValueObject,
} from '@value-objects/sale';

export class SaleProductDomainModel extends EntityBase {
  number: number;
  productName: string;
  productQuantity: number;
  productPrice: number;

  constructor(
    number: number,
    productName: string,
    productQuantity: number,
    productPrice: number,
    id?: string,
  ) {
    super(id);
    this.number = number;
    this.productName = productName;
    this.productQuantity = productQuantity;
    this.productPrice = productPrice;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const number = new SaleNumberValueObject(this.number);
    const product = new SaleProductValueObject({
      name: this.productName,
      quantity: this.productQuantity,
      price: this.productPrice,
    });
    const response: ValueObjectBase<any>[] = [number, number, product];
    if (this.id) response.push(new SaleIdValueObject(this.id));
    return response;
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    let errors = new Array<IErrorValueObject>();
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        errors = [...errors, ...valueObject.getErrors()];
      }
    }
    return errors;
  }

  hasErrors(): boolean {
    return !!this.getErrors().length;
  }

  getErrors(): IErrorValueObject[] {
    const valueObjects = this.createValueObjects();
    return this.validateValueObjects(valueObjects);
  }
}
