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
    private ProductPostgresEntity: Repository<ProductPostgresEntity>,
  ) {}

  create(entity: ProductPostgresEntity): Observable<ProductPostgresEntity> {
    return from(this.ProductPostgresEntity.save(entity)).pipe(
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
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((product: ProductPostgresEntity) => {
          const entityUpdated = {
            ...product,
            ...entity,
            id: entityId,
          };
          return from(this.ProductPostgresEntity.save(entityUpdated));
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
    return from(this.findOneById(entityId))
      .pipe(
        switchMap((product: ProductPostgresEntity) => {
          return this.ProductPostgresEntity.remove(product);
        }),
      )
      .pipe(
        catchError((error: PostgresError) => {
          return throwError(() => new BadRequestException(error.detail));
        }),
      );
  }

  findAll(): Observable<ProductPostgresEntity[]> {
    return from(this.ProductPostgresEntity.find()).pipe(
      catchError((error: PostgresError) => {
        return throwError(() => new BadRequestException(error.detail));
      }),
    );
  }

  findOneById(entityId: string): Observable<ProductPostgresEntity> {
    return from(
      this.ProductPostgresEntity.findOneBy({
        id: entityId,
      }),
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