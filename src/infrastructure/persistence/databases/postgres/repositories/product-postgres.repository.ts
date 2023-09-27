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

export class ProductPostgresRepository
  implements IRepositoryBaseInterface<ProductPostgresEntity>
{
  constructor(
    @InjectRepository(ProductPostgresEntity)
    private ProductPostgresEntity: Repository<ProductPostgresEntity>,
  ) {}

  create(entity: ProductPostgresEntity): Observable<ProductPostgresEntity> {
    console.log(entity);
    return from(this.ProductPostgresEntity.save(entity)).pipe(
      catchError((error: Error) => {
        return throwError(
          () => new ConflictException('Product create conflict', error.message),
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
        catchError((error: Error) => {
          return throwError(
            () =>
              new ConflictException('Product update conflict', error.message),
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
        catchError((error: Error) => {
          return throwError(() => new BadRequestException(error.message));
        }),
      );
  }

  findAll(): Observable<ProductPostgresEntity[]> {
    return from(this.ProductPostgresEntity.find()).pipe(
      catchError((error: Error) => {
        return throwError(() => new BadRequestException(error.message));
      }),
    );
  }

  findOneById(entityId: string): Observable<ProductPostgresEntity> {
    return from(
      this.ProductPostgresEntity.findOneBy({
        id: entityId,
      }),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException('Invalid ID format', error.message);
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
