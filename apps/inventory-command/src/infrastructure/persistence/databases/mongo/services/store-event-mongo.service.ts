import { Observable } from 'rxjs';
import { StoreEventMongoModel } from '../models';
import { IEventDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { StoreEventMongoRepository } from '../repositories';
import { TypeNameEnum } from '@enums';

@Injectable()
export class EventMongoService
  implements IEventDomainService<StoreEventMongoModel>
{
  constructor(
    private readonly storedEventMongoRepository: StoreEventMongoRepository,
  ) {}

  getLastEventByEntityId(
    entityId: string,
    typeName: TypeNameEnum[],
    aggregateRootId?: string,
  ): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.getLastEventByEntityId(
      entityId,
      typeName,
      aggregateRootId,
    );
  }
  entityAlreadyExist(
    key: string,
    value: string,
    typeName: TypeNameEnum[],
    aggregateRootId?: string,
  ): Observable<boolean> {
    return this.storedEventMongoRepository.entityAlreadyExist(
      key,
      value,
      typeName,
      aggregateRootId,
    );
  }

  storeEvent(entity: StoreEventMongoModel): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.storeEvent(entity);
  }

  getEvent(id: string): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.findOneById(id);
  }

  getAllEvents(): Observable<StoreEventMongoModel[]> {
    return this.storedEventMongoRepository.findAll();
  }

  generateIncrementalSaleId(
    aggregateRootId: string,
    typeName: TypeNameEnum[],
  ): Observable<number> {
    return this.storedEventMongoRepository.generateIncrementalSaleId(
      aggregateRootId,
      typeName,
    );
  }
}
