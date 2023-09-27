import {
  UserIdValueObject,
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '@value-objects/user';

export interface IUserDomainModel {
  id?: string | UserIdValueObject;
  name: string | UserNameValueObject;
  email: string | UserEmailValueObject;
  password: string | UserPasswordValueObject;
  role: string | UserRoleValueObject;
}
