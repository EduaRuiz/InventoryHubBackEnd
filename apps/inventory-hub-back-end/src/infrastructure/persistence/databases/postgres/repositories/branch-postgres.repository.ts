import { IRepositoryBaseInterface } from './interfaces';
import { BranchPostgresEntity } from '../entities';
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

export class BranchPostgresRepository
  implements IRepositoryBaseInterface<BranchPostgresEntity>
{
  constructor(
    @InjectRepository(BranchPostgresEntity)
    private BranchPostgresEntity: Repository<BranchPostgresEntity>,
  ) {}

  create(entity: BranchPostgresEntity): Observable<BranchPostgresEntity> {
    return from(this.BranchPostgresEntity.save(entity)).pipe(
      catchError((error: PostgresError) => {
        return throwError(
          () => new ConflictException('Branch create conflict', error.detail),
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: BranchPostgresEntity,
  ): Observable<BranchPostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((branch: BranchPostgresEntity) => {
          const entityUpdated = {
            ...branch,
            ...entity,
            id: entityId,
          };
          return from(this.BranchPostgresEntity.save(entityUpdated));
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(
            () => new ConflictException('Branch update conflict', error.detail),
          );
        }),
      );
  }

  delete(entityId: string): Observable<BranchPostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((branch: BranchPostgresEntity) => {
          return this.BranchPostgresEntity.remove(branch);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  findAll(): Observable<BranchPostgresEntity[]> {
    return from(
      this.BranchPostgresEntity.find({
        relations: ['users', 'products'],
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<BranchPostgresEntity> {
    return from(
      this.BranchPostgresEntity.findOne({
        where: {
          id: entityId,
        },
        relations: ['users', 'products'],
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException('Invalid ID format', error.detail);
      }),
      switchMap((branch: BranchPostgresEntity) =>
        iif(
          () => branch === null,
          throwError(() => new NotFoundException('Branch not found!')),
          of(branch),
        ),
      ),
    );
  }
}
