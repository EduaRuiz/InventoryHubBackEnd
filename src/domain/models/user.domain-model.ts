import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import {
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
  UserIdValueObject,
  UserBranchIdValueObject,
} from '@value-objects/user';

export class UserDomainModel extends ValueObjectErrorHandler {
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
    super();
    this.id = id;
    this.name = name?.toUpperCase()?.trim();
    this.email = email?.trim();
    this.password = password;
    this.role = role;
    this.branchId = branchId;
    this.init();
  }

  private init(): void {
    const valueObjects = this.createValueObjects();
    this.validateValueObjects(valueObjects);
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
    console.log(response);
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
