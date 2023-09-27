export interface INewUserDomainDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  branchId?: string;
}
