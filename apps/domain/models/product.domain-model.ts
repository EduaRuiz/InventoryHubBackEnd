import { ValueObjectBase } from '@sofka/bases';
import {
  ProductBranchIdValueObject,
  ProductCategoryValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductQuantityValueObject,
} from '..';
import { IErrorValueObject } from '@sofka/interfaces';
import { EntityBase } from '@sofka/bases/entity.base';

export class ProductDomainModel extends EntityBase {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  branchId: string;

  constructor(
    name: string,
    description: string,
    price: number,
    quantity: number,
    category: string,
    branchId: string,
    id?: string,
  ) {
    super(id);
    this.name = name?.toUpperCase()?.trim();
    this.description = description?.trim();
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.branchId = branchId;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const name = new ProductNameValueObject(this.name);
    const description = new ProductDescriptionValueObject(this.description);
    const price = new ProductPriceValueObject(this.price);
    const quantity = new ProductQuantityValueObject(this.quantity);
    const category = new ProductCategoryValueObject(this.category);
    const branchId = new ProductBranchIdValueObject(this.branchId);
    const response: ValueObjectBase<any>[] = [
      name,
      description,
      price,
      quantity,
      category,
      branchId,
    ];
    if (this.id) response.push(new ProductIdValueObject(this.id));
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
