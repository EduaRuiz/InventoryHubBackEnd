import { IRepositoryBaseInterface } from './interfaces';
import { ProductPostgresEntity } from '../entities';
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

export class ProductPostgresRepository
  implements IRepositoryBaseInterface<ProductPostgresEntity>
{
  constructor(
    @InjectRepository(ProductPostgresEntity)
    private productPostgresEntity: Repository<ProductPostgresEntity>,
  ) {}

  create(entity: ProductPostgresEntity): Observable<ProductPostgresEntity> {
    return from(this.productPostgresEntity.save(entity)).pipe(
      catchError((error: PostgresError) => {
        return throwError(
          () => new ConflictException('Product create conflict', error.detail),
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: ProductPostgresEntity,
  ): Observable<ProductPostgresEntity> {
    return this.findOneById(entityId)
      .pipe(
        switchMap((product: ProductPostgresEntity) => {
          const entityUpdated = {
            ...product,
            ...entity,
            id: entityId,
          } as ProductPostgresEntity;
          console.log('++++++++++++++++++++++++++++');
          return this.create(entityUpdated);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(
            () =>
              new ConflictException('Product update conflict', error.detail),
          );
        }),
      );
  }

  delete(entityId: string): Observable<ProductPostgresEntity> {
    return this.findOneById(entityId)
      .pipe(
        switchMap((product: ProductPostgresEntity) => {
          return this.productPostgresEntity.remove(product);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  findAll(): Observable<ProductPostgresEntity[]> {
    return from(this.productPostgresEntity.find()).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findAllByBranchId(
    branchId: string,
    page: number,
    pageSize: number,
  ): Observable<ProductPostgresEntity[]> {
    const offset = (page - 1) * pageSize;
    return from(
      this.productPostgresEntity.find({
        where: { branchId: branchId },
        skip: offset,
        take: pageSize,
      }),
    ).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<ProductPostgresEntity> {
    console.log(entityId);
    return from(
      this.productPostgresEntity.findOne({ where: { id: entityId } }),
    ).pipe(
      catchError((error: PostgresError) => {
        throw new BadRequestException('Invalid ID format', error.detail);
      }),
      switchMap((product: ProductPostgresEntity) =>
        iif(
          () => product === null,
          throwError(() => new NotFoundException('Product not found!')),
          of(product),
        ),
      ),
    );
  }
}
