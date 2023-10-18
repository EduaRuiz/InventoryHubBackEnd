import { IRepositoryBaseInterface } from './interfaces';
import { UserPostgresEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import {
  Observable,
  catchError,
  from,
  iif,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { PostgresError } from '@types';

export class UserPostgresRepository
  implements IRepositoryBaseInterface<UserPostgresEntity>
{
  constructor(
    @InjectRepository(UserPostgresEntity)
    private UserPostgresEntity: Repository<UserPostgresEntity>,
  ) {}

  create(entity: UserPostgresEntity): Observable<UserPostgresEntity> {
    return from(this.saveEntity(entity));
  }

  private async saveEntity(
    entity: UserPostgresEntity,
  ): Promise<UserPostgresEntity> {
    try {
      const savedEntity = await this.UserPostgresEntity.save(entity);
      return savedEntity;
    } catch (error) {
      throw new ConflictException('User create conflict', error.detail);
    }
  }

  update(
    entityId: string,
    entity: UserPostgresEntity,
  ): Observable<UserPostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((user: UserPostgresEntity) => {
          const entityUpdated = {
            ...user,
            ...entity,
            id: entityId,
          };
          return from(this.UserPostgresEntity.save(entityUpdated));
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(
            () => new ConflictException('User update conflict', error.detail),
          );
        }),
      );
  }

  delete(entityId: string): Observable<UserPostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((user: UserPostgresEntity) => {
          return this.UserPostgresEntity.remove(user);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  findAll(): Observable<UserPostgresEntity[]> {
    return from(this.UserPostgresEntity.find()).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<UserPostgresEntity> {
    return from(
      this.UserPostgresEntity.findOneBy({
        id: entityId,
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException(error.detail);
      }),
      switchMap((user: UserPostgresEntity) =>
        iif(
          () => user === null,
          throwError(() => new NotFoundException('User not found!')),
          of(user),
        ),
      ),
    );
  }
  findOneByEmail(email: string): Observable<UserPostgresEntity> {
    return from(
      this.UserPostgresEntity.findOneBy({
        email: email,
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException(error.detail);
      }),
      switchMap((user: UserPostgresEntity) =>
        iif(
          () => user === null,
          throwError(() => new NotFoundException('User not found!')),
          of(user),
        ),
      ),
    );
  }

  login(email: string, password: string): Observable<UserPostgresEntity> {
    return from(
      this.UserPostgresEntity.findOneBy({
        email: email,
        password: password,
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException(error.detail);
      }),
      switchMap((user: UserPostgresEntity) =>
        iif(
          () => user === null,
          throwError(() => new NotFoundException('User not found!')),
          of(user),
        ),
      ),
    );
  }
}
