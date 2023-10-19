import {
  ProductDomainModel,
  SaleDomainModel,
  UserDomainModel,
} from '@domain-models';
import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import {
  BranchIdValueObject,
  BranchLocationValueObject,
  BranchNameValueObject,
} from '@value-objects/branch';
import { EntityBase } from '@sofka/bases';

export class BranchDomainModel extends EntityBase {
  name: string;
  location: string;
  products: ProductDomainModel[];
  users: UserDomainModel[];
  sales: SaleDomainModel[];

  constructor(
    name: string,
    location: string,
    products: ProductDomainModel[],
    users: UserDomainModel[],
    sales: SaleDomainModel[],
    id?: string,
  ) {
    super(id);
    this.name = name;
    this.location = location;
    this.products = products;
    this.sales = sales;
    this.users = users;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const locationData = {
      city: this.location?.split(',')[0]?.trim(),
      country: this.location?.split(',')[1]?.trim(),
    };
    const location = new BranchLocationValueObject(locationData);
    const name = new BranchNameValueObject(this.name);
    const response: ValueObjectBase<any>[] = [location, name];
    if (this.id) response.push(new BranchIdValueObject(this.id));
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
