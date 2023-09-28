import {
  UserIdValueObject,
  UserNameValueObject,
  UserEmailValueObject,
  UserPasswordValueObject,
  UserRoleValueObject,
  UserBranchIdValueObject,
} from '../values/user';

export interface UserDomainModel {
  id?: string | UserIdValueObject;
  name: string | UserNameValueObject;
  email: string | UserEmailValueObject;
  password: string | UserPasswordValueObject;
  role: string | UserRoleValueObject;
  branchId?: string | UserBranchIdValueObject;
}
