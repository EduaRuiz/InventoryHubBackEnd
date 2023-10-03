import { Injectable } from '@nestjs/common';
import { UserPostgresRepository } from '../repositories';
import { UserPostgresEntity } from '../entities';
import { IUserDomainService } from '@domain-services';
import { Observable } from 'rxjs';

@Injectable()
export class UserPostgresService
  implements IUserDomainService<UserPostgresEntity>
{
  constructor(
    private readonly userPostgresRepository: UserPostgresRepository,
  ) {}

  getUserById(id: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.findOneById(id);
  }

  getUserByEmail(email: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.findOneByEmail(email);
  }

  getAllUsers(): Observable<UserPostgresEntity[]> {
    return this.userPostgresRepository.findAll();
  }

  deleteUser(id: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.delete(id);
  }

  createUser(user: UserPostgresEntity): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.create(user);
  }
  updateUser(user: UserPostgresEntity): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.update(user.id, user);
  }

  getUser(id: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.findOneById(id);
  }
}
