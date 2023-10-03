import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import {
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
  UserIdValueObject,
  UserBranchIdValueObject,
} from '@value-objects/user';

export class UserDomainModel {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: string;
  branchId?: string;

  constructor(
    name: string,
    email: string,
    password: string,
    role: string,
    branchId?: string,
    id?: string,
  ) {
    this.id = id;
    this.name = name?.toUpperCase()?.trim();
    this.email = email?.trim();
    this.password = password;
    this.role = role;
    this.branchId = branchId;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const fullName = {
      firstName: this.name?.split(' ')[0],
      lastName: this.name?.split(' ')[1],
    };
    const name = new UserNameValueObject(fullName);
    const email = new UserEmailValueObject(this.email);
    const password = new UserPasswordValueObject(this.password);
    const role = new UserRoleValueObject(this.role);
    const response: ValueObjectBase<any>[] = [name, email, password, role];
    if (this.id) response.push(new UserIdValueObject(this.id));
    if (this.branchId)
      response.push(new UserBranchIdValueObject(this.branchId));
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
