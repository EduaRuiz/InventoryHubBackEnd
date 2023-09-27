import {
  Observable,
  catchError,
  from,
  iif,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { IRepositoryBase } from './interfaces';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StoredEventMongoModel } from '../models';

export class StoredEventMongoRepository
  implements IRepositoryBase<StoredEventMongoModel>
{
  constructor(
    @InjectModel(StoredEventMongoModel.name)
    private storedEventMongoModel: Model<StoredEventMongoModel>,
  ) {}

  create(entity: StoredEventMongoModel): Observable<StoredEventMongoModel> {
    return from(this.storedEventMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(
          'StoredEvent create conflict',
          error.message,
        );
      }),
    );
  }

  update(
    entityId: string,
    entity: StoredEventMongoModel,
  ): Observable<StoredEventMongoModel> {
    return this.findOneById(entityId).pipe(
      mergeMap(() => {
        return from(
          this.storedEventMongoModel.findByIdAndUpdate(
            { _id: entityId.toString() },
            { ...entity, _id: entityId.toString() },
            { new: true },
          ),
        ).pipe(
          map((updatedEntity) => {
            if (!updatedEntity) {
              throw new ConflictException('StoredEvent not found');
            }
            return updatedEntity as StoredEventMongoModel;
          }),
          catchError((error: Error) => {
            throw new ConflictException(
              'StoredEvent update conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  delete(entityId: string): Observable<StoredEventMongoModel> {
    return this.findOneById(entityId).pipe(
      switchMap(() => {
        return from(
          this.storedEventMongoModel.findByIdAndDelete(
            { _id: entityId.toString() },
            { new: true },
          ),
        ).pipe(
          map((updatedEntity) => {
            if (!updatedEntity) {
              throw new ConflictException('StoredEvent not found');
            }
            return updatedEntity as StoredEventMongoModel;
          }),
        );
      }),
    );
  }

  findAll(): Observable<StoredEventMongoModel[]> {
    return from(
      this.storedEventMongoModel
        .find({}, {}, { populate: 'storedEvent' })
        .exec(),
    ).pipe(
      map((entities: StoredEventMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<StoredEventMongoModel> {
    return from(
      this.storedEventMongoModel.findById({ _id: entityId.toString() }, {}),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'StoredEvent invalid ID format',
          error.message,
        );
      }),
      switchMap((storedEvent: StoredEventMongoModel) =>
        iif(
          () => storedEvent === null,
          throwError(() => new NotFoundException('StoredEvent not found')),
          of(storedEvent),
        ),
      ),
    );
  }
}
