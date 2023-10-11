import { IRepositoryBaseInterface } from './interfaces';
import { SaleProductPostgresEntity } from '../entities';
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

export class SaleProductPostgresRepository
  implements IRepositoryBaseInterface<SaleProductPostgresEntity>
{
  constructor(
    @InjectRepository(SaleProductPostgresEntity)
    private saleProductPostgresEntity: Repository<SaleProductPostgresEntity>,
  ) {}

  create(
    entity: SaleProductPostgresEntity,
  ): Observable<SaleProductPostgresEntity> {
    return from(this.saleProductPostgresEntity.save(entity)).pipe(
      catchError((error: PostgresError) => {
        return throwError(
          () =>
            new ConflictException('SaleProduct create conflict', error.detail),
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: SaleProductPostgresEntity,
  ): Observable<SaleProductPostgresEntity> {
    return this.findOneById(entityId)
      .pipe(
        switchMap((saleProduct: SaleProductPostgresEntity) => {
          const entityUpdated = {
            ...saleProduct,
            ...entity,
            id: entityId,
          } as SaleProductPostgresEntity;
          return this.create(entityUpdated);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(
            () =>
              new ConflictException(
                'SaleProduct update conflict',
                error.detail,
              ),
          );
        }),
      );
  }

  delete(entityId: string): Observable<SaleProductPostgresEntity> {
    return this.findOneById(entityId)
      .pipe(
        switchMap((saleProduct: SaleProductPostgresEntity) => {
          return this.saleProductPostgresEntity.remove(saleProduct);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  findAll(): Observable<SaleProductPostgresEntity[]> {
    return from(this.saleProductPostgresEntity.find()).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findAllBySaleId(
    saleId: string,
    page: number,
    pageSize: number,
  ): Observable<SaleProductPostgresEntity[]> {
    const offset = (page - 1) * pageSize;
    return from(
      this.saleProductPostgresEntity.find({
        where: { saleId: saleId },
        skip: offset,
        take: pageSize,
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<SaleProductPostgresEntity> {
    return from(
      this.saleProductPostgresEntity.findOne({ where: { id: entityId } }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException('Invalid ID format', error.detail);
      }),
      switchMap((saleProduct: SaleProductPostgresEntity) =>
        iif(
          () => saleProduct === null,
          throwError(() => new NotFoundException('SaleProduct not found!')),
          of(saleProduct),
        ),
      ),
    );
  }
}
