import { FullName } from '@types';
export interface INewUserDomainCommand {
  fullName: FullName;
  email: string;
  password: string;
  role: string;
  branchId: string;
}
