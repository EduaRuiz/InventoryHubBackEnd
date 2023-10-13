import { UserDomainModel } from '@domain-models/index';
import { Observable } from 'rxjs';
import { ILoginResponse } from '../interfaces';

export interface IAuthDomainService {
  generateAuthResponse(user: UserDomainModel): Observable<ILoginResponse>;
  verifyRefreshToken(token: string, userId: string): Observable<boolean>;
}
