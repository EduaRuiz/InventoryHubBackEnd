import {
  Observable,
  catchError,
  from,
  iif,
  map,
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
import { StoreEventMongoModel } from '../models';
import { TypeNameEnum } from '@enums';

export class StoreEventMongoRepository
  implements IRepositoryBase<StoreEventMongoModel>
{
  constructor(
    @InjectModel(StoreEventMongoModel.name)
    private storedEventMongoModel: Model<StoreEventMongoModel>,
  ) {}

  storeEventUpdate(
    entity: StoreEventMongoModel,
  ): Observable<StoreEventMongoModel> {
    return from(this.storedEventMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException(
          'StoreEvent create conflict',
          error.message,
        );
      }),
    );
  }

  storeEvent(entity: StoreEventMongoModel): Observable<StoreEventMongoModel> {
    const eventBody = JSON.parse(entity.eventBody);
    const subString = eventBody.email
      ? `"email":"${eventBody.email}"`
      : `"name":"${eventBody.name}"`;
    return this.findByEventBody(
      subString,
      entity.typeName,
      entity?.aggregateRootId,
    ).pipe(
      switchMap((events) => {
        if (events.length > 0) {
          throw new ConflictException(
            `${subString} already exists`.replace(/"/g, ''),
          );
        }
        return from(this.storedEventMongoModel.create(entity)).pipe(
          catchError((error: Error) => {
            throw new ConflictException(
              'StoreEvent create conflict',
              error.message,
            );
          }),
        );
      }),
    );
  }

  findAll(): Observable<StoreEventMongoModel[]> {
    return from(
      this.storedEventMongoModel
        .find({}, {}, { populate: 'storedEvent' })
        .exec(),
    ).pipe(
      map((entities: StoreEventMongoModel[]) => {
        return entities;
      }),
    );
  }

  findOneById(entityId: string): Observable<StoreEventMongoModel> {
    return from(
      this.storedEventMongoModel.findById({ _id: entityId.toString() }, {}),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'StoreEvent invalid ID format',
          error.message,
        );
      }),
      switchMap((storedEvent: StoreEventMongoModel) =>
        iif(
          () => storedEvent === null,
          throwError(() => new NotFoundException('StoreEvent not found')),
          of(storedEvent),
        ),
      ),
    );
  }

  findByEventBody(
    substring: string,
    typeName: string,
    rootId?: string,
  ): Observable<StoreEventMongoModel[]> {
    let query: any = {
      eventBody: { $regex: new RegExp(substring, 'i') },
      typeName,
    };
    if (rootId !== undefined && typeName !== TypeNameEnum.BRANCH_REGISTERED) {
      query = { ...query, aggregateRootId: rootId };
    }
    return from(this.storedEventMongoModel.find(query).exec()).pipe(
      map((entities: StoreEventMongoModel[]) => entities),
      catchError((error: Error) => {
        throw new BadRequestException(
          'Error searching by event body substring',
          error.message,
        );
      }),
    );
  }

  findLastByIdEventBody(entityId: string): Observable<StoreEventMongoModel> {
    return from(
      this.storedEventMongoModel
        .findOne({
          eventBody: { $regex: new RegExp(`"id":"${entityId}"`, 'i') },
        })
        .sort({ _id: -1 })
        .exec(),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Error searching by event body substring',
          error.message,
        );
      }),
      switchMap((storedEvent: StoreEventMongoModel) =>
        storedEvent
          ? of(storedEvent)
          : throwError(() => new NotFoundException('StoreEvent not found')),
      ),
    );
  }

  findByAggregateRootId(
    aggregateRootId: string,
  ): Observable<StoreEventMongoModel> {
    return from(
      this.storedEventMongoModel
        .findOne({ aggregateRootId: aggregateRootId.toString() }, {})
        .sort({ _id: -1 })
        .exec(),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(
          'Error searching by event body substring',
          error.message,
        );
      }),
      switchMap((storedEvent: StoreEventMongoModel) =>
        storedEvent
          ? of(storedEvent)
          : throwError(() => new NotFoundException('StoreEvent not found')),
      ),
    );
  }
}
