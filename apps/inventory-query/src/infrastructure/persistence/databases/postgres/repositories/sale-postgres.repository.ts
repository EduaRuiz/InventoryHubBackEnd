import { IRepositoryBaseInterface } from './interfaces';
import { SalePostgresEntity } from '../entities';
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

export class SalePostgresRepository
  implements IRepositoryBaseInterface<SalePostgresEntity>
{
  constructor(
    @InjectRepository(SalePostgresEntity)
    private SalePostgresEntity: Repository<SalePostgresEntity>,
  ) {}
  findAll(): Observable<SalePostgresEntity[]> {
    throw new Error('Method not implemented.');
  }

  create(entity: SalePostgresEntity): Observable<SalePostgresEntity> {
    return from(this.SalePostgresEntity.save(entity)).pipe(
      catchError((error: PostgresError) => {
        return throwError(
          () => new ConflictException('Sale create conflict', error.detail),
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: SalePostgresEntity,
  ): Observable<SalePostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((sale: SalePostgresEntity) => {
          const entityUpdated = {
            ...sale,
            ...entity,
            id: entityId,
          };
          return from(this.SalePostgresEntity.save(entityUpdated));
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(
            () => new ConflictException('Sale update conflict', error.detail),
          );
        }),
      );
  }

  delete(entityId: string): Observable<SalePostgresEntity> {
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((sale: SalePostgresEntity) => {
          return this.SalePostgresEntity.remove(sale);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  getAll(page: number, pageSize: number): Observable<SalePostgresEntity[]> {
    const offset = (page - 1) * pageSize;
    return from(
      this.SalePostgresEntity.find({
        relations: ['products'],
        skip: offset,
        take: pageSize,
        order: { date: 'DESC' },
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<SalePostgresEntity> {
    return from(
      this.SalePostgresEntity.findOne({
        where: {
          id: entityId,
        },
        relations: ['sale_product'],
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException(error.detail);
      }),
      switchMap((sale: SalePostgresEntity) =>
        iif(
          () => sale === null,
          throwError(() => new NotFoundException('Sale not found!')),
          of(sale),
        ),
      ),
    );
  }

  findAllByBranchId(
    branchId: string,
    page: number,
    pageSize: number,
  ): Observable<SalePostgresEntity[]> {
    const offset = (page - 1) * pageSize;
    return from(
      this.SalePostgresEntity.find({
        where: {
          branchId,
        },
        relations: ['products'],
        skip: offset,
        take: pageSize,
        order: { date: 'DESC' },
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }
}
