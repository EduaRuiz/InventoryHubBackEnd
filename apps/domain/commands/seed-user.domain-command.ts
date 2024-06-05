import { FullName } from '@types';
export interface ISeedUserDomainCommand {
  fullName: FullName;
  email: string;
  password: string;
  role: string;
}
