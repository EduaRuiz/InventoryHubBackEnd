import { IUserAuthData } from '.';

export interface ILoginResponse {
  data: IUserAuthData;
  token: string;
}
