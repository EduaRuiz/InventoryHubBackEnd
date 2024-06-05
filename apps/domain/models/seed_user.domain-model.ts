import { EntityBase, ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import {
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
  UserIdValueObject,
} from '@value-objects/user';

export class SeedUserDomainModel extends EntityBase {
  fullName: string;
  email: string;
  password: string;
  role: string;

  constructor(
    fullName: string,
    email: string,
    password: string,
    role: string,
    id?: string,
  ) {
    super(id);
    this.fullName = fullName?.toUpperCase()?.trim();
    this.email = email?.trim();
    this.password = password;
    this.role = role;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const fullName = {
      firstName: this.fullName?.split(' ')[0],
      lastName: this.fullName?.split(' ')[1],
    };
    const name = new UserNameValueObject(fullName);
    const email = new UserEmailValueObject(this.email);
    const password = new UserPasswordValueObject(this.password);
    const role = new UserRoleValueObject(this.role);
    const response: ValueObjectBase<any>[] = [name, email, password, role];
    if (this.id) response.push(new UserIdValueObject(this.id));
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
