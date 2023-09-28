import { ProductDomainModel, UserDomainModel } from '@domain-models';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  BranchIdValueObject,
  BranchLocationValueObject,
  BranchNameValueObject,
} from '@value-objects/branch';

export class BranchDomainModel extends ValueObjectErrorHandler {
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
    super();
    this.id = id;
    this.name = name;
    this.location = location;
    this.products = products;
    this.users = users;
    this.init();
  }

  private init(): void {
    const valueObjects = this.createValueObjects();
    this.validateValueObjects(valueObjects);
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
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
    return this.getErrors();
  }
}
