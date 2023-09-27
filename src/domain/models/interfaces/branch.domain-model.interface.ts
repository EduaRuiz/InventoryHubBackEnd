import { ProductDomainModel, UserDomainModel } from '@domain-models';
import {
  BranchIdValueObject,
  BranchLocationValueObject,
  BranchNameValueObject,
} from 'src/domain/values/branch';

export interface IBranchDomainModel {
  id?: string | BranchIdValueObject;
  name: string | BranchNameValueObject;
  location: string | BranchLocationValueObject;
  products: ProductDomainModel[];
  users: UserDomainModel[];
}
