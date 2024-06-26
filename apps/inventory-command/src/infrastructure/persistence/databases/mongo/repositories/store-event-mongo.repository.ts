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

  getLastEventByEntityId(
    entityId: string,
    array: TypeNameEnum[],
    aggregateRootId?: string,
  ): Observable<StoreEventMongoModel> {
    let query: object = {
      'eventBody.id': entityId,
      typeName: { $in: array },
    };
    if (aggregateRootId !== undefined) query = { ...query, aggregateRootId };
    return from(
      this.storedEventMongoModel.findOne(query).sort({ occurredOn: -1 }).exec(),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(error.message);
      }),
      switchMap((storedEvent: StoreEventMongoModel) => {
        return iif(
          () => storedEvent === null,
          throwError(() => new NotFoundException('Event not found')),
          of(storedEvent),
        );
      }),
    );
  }

  entityAlreadyExist(
    key: string,
    value: string,
    typeName: TypeNameEnum[],
    aggregateRootId?: string,
  ): Observable<boolean> {
    let query: any = {};
    query[`eventBody.${key}`] = value;
    query = { ...query, typeName: { $in: typeName } };
    if (aggregateRootId != undefined)
      query = { ...query, aggregateRootId: { $in: [aggregateRootId, 'NULL'] } };
    return from(
      this.storedEventMongoModel.findOne(query).sort({ _id: -1 }).exec(),
    ).pipe(
      catchError((error: Error) => {
        throw new BadRequestException(error.message);
      }),
      map((event: StoreEventMongoModel) => {
        if (event && event !== null) return true;
        return false;
      }),
    );
  }

  storeEventUpdate(
    entity: StoreEventMongoModel,
  ): Observable<StoreEventMongoModel> {
    return from(this.storedEventMongoModel.create(entity)).pipe(
      catchError((error: Error) => {
        throw new ConflictException('Event create conflict', error.message);
      }),
    );
  }

  storeEvent(entity: StoreEventMongoModel): Observable<StoreEventMongoModel> {
    const subString = 'eventBody.email'
      ? `"email":"${'eventBody.email'}"`
      : `"name":"${'eventBody.name'}"`;
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
            throw new ConflictException('Event create conflict', error.message);
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
        throw new BadRequestException(error.message);
      }),
      switchMap((storedEvent: StoreEventMongoModel) =>
        iif(
          () => storedEvent === null,
          throwError(() => new NotFoundException('Event not found')),
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

  generateIncrementalSaleId(
    aggregateRootId: string,
    typeName: TypeNameEnum[],
  ): Observable<number> {
    return from(
      this.storedEventMongoModel.countDocuments({
        aggregateRootId,
        typeName: { $in: typeName },
      }),
    ).pipe(
      map((count: number) => count + 1),
      catchError((error: Error) => {
        throw new BadRequestException(
          'Error searching by event body substring',
          error.message,
        );
      }),
    );
  }
}
