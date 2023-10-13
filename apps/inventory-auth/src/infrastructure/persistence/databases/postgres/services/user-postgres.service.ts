import { Injectable } from '@nestjs/common';
import { UserPostgresRepository } from '../repositories';
import { UserPostgresEntity } from '../entities';
import { IUserAuthDomainService } from '@domain-services';
import { Observable } from 'rxjs';

@Injectable()
export class UserPostgresService
  implements IUserAuthDomainService<UserPostgresEntity>
{
  constructor(
    private readonly userPostgresRepository: UserPostgresRepository,
  ) {}
  login(email: string, password: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.login(email, password);
  }
  findById(id: string): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.findOneById(id);
  }
  registerUser(user: UserPostgresEntity): Observable<UserPostgresEntity> {
    return this.userPostgresRepository.create(user);
  }
}
