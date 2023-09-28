import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  ProductBranchIdValueObject,
  ProductDescriptionValueObject,
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductQuantityValueObject,
} from '..';

export class ProductDomainModel extends ValueObjectErrorHandler {
  id?: string;
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
    super();
    this.id = id;
    this.name = name?.toUpperCase()?.trim();
    this.description = description?.trim();
    this.price = price;
    this.quantity = quantity;
    this.category = category;
    this.branchId = branchId;
    this.init();
  }

  private init(): void {
    const valueObjects = this.createValueObjects();
    this.validateValueObjects(valueObjects);
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const name = new ProductNameValueObject(this.name);
    const description = new ProductDescriptionValueObject(this.description);
    const price = new ProductPriceValueObject(this.price);
    const quantity = new ProductQuantityValueObject(this.quantity);
    const branchId = new ProductBranchIdValueObject(this.branchId);
    const response: ValueObjectBase<any>[] = [
      name,
      description,
      price,
      quantity,
      branchId,
    ];
    if (this.id) response.push(new ProductIdValueObject(this.id));
    return response;
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]): void {
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
  }
}
