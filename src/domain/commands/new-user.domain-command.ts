export interface INewUserDomainCommand {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  branchId: string;
}
