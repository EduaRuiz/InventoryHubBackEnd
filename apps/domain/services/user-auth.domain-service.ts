import { Observable } from 'rxjs';
import { UserDomainModel } from '..';

export interface IUserAuthDomainService<
  Entity extends UserDomainModel = UserDomainModel,
> {
  login(email: string, password: string): Observable<Entity>;
  registerUser(user: Entity): Observable<Entity>;
  findById(id: string): Observable<Entity>;
}
