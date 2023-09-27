import {
  UserIdValueObject,
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
} from '../values/user';

export interface UserDomainModel {
  id?: string | UserIdValueObject;
  name: string | UserNameValueObject;
  email: string | UserEmailValueObject;
  password: string | UserPasswordValueObject;
  role: string | UserRoleValueObject;
}
