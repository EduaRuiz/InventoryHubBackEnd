import { ProductDomainModel, UserDomainModel } from '@domain-models';
import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { v4 as UUIDv4 } from 'uuid';
import {
  BranchIdValueObject,
  BranchLocationValueObject,
  BranchNameValueObject,
} from '@value-objects/branch';

export class BranchDomainModel {
  id?: string;
  name: string;
  location: string;
  products: ProductDomainModel[];
  users: UserDomainModel[];

  constructor(
    name: string,
    location: string,
    products: ProductDomainModel[],
    users: UserDomainModel[],
    id?: string,
  ) {
    if (id) this.id = id;
    else this.id = UUIDv4();
    this.name = name;
    this.location = location;
    this.products = products;
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
