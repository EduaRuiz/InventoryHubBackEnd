import { Observable } from 'rxjs';
import { UserDomainModel } from '..';

export interface IUserAuthDomainService<
  User extends UserDomainModel = UserDomainModel,
> {
  login(email: string, password: string): Observable<User>;
  registerUser(user: User): Observable<User>;
  findById(id: string): Observable<User>;
}
