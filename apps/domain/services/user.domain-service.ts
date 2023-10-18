import { UserDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import { UserRoleEnum } from '../enums/user-role.enum';

export interface IUserDomainService<
  Entity extends UserDomainModel = UserDomainModel,
> {
  getUserById(id: string): Observable<Entity>;
  getUserByEmail(email: string): Observable<Entity>;
  deleteUser(id: string): Observable<Entity>;
  createUser(user: Entity): Observable<Entity>;
  updateUser(user: Entity): Observable<Entity>;
  getAllUsers(): Observable<Entity[]>;
  getAllUsersByBranchIdAndRol(
    branchId: string,
    role: UserRoleEnum,
  ): Observable<Entity[]>;
}
