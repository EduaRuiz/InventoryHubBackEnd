import {
  UserIdValueObject,
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
} from '../values/user';

export class UserDomainModel {
  id: string | UserIdValueObject;
  name: string | UserNameValueObject;
  email: string | UserEmailValueObject;
  password: string | UserPasswordValueObject;
}
