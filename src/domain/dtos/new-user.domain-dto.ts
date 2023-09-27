export interface INewUserDomainDto {
  name: string;
  email: string;
  password: string;
  role: string;
  branchId?: string;
}
