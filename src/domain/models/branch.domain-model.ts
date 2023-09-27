import {
  BranchIdValueObject,
  BranchNameValueObject,
  BranchLocationValueObject,
} from '../values/branch';
import { ProductDomainModel, UserDomainModel } from '@domain-models';
import { IBranchDomainModel } from './interfaces';

export class BranchDomainModel implements IBranchDomainModel {
  id?: string | BranchIdValueObject;
  name: string | BranchNameValueObject;
  location: string | BranchLocationValueObject;
  products: ProductDomainModel[];
  users: UserDomainModel[];
}
