import { Observable } from 'rxjs';
import { StoreEventMongoModel } from '../models';
import { IStoreEventDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { StoreEventMongoRepository } from '../repositories';

@Injectable()
export class StoreEventMongoService
  implements IStoreEventDomainService<StoreEventMongoModel>
{
  constructor(
    private readonly storedEventMongoRepository: StoreEventMongoRepository,
  ) {}
  getEventByAggregateRootId(id: string): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.findByAggregateRootId(id);
  }
  storeEventUpdate(
    event: StoreEventMongoModel,
  ): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.storeEventUpdate(event);
  }

  getLastEventByIdEventBody(
    idEventBody: string,
  ): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.findLastByIdEventBody(idEventBody);
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

  createEvent(entity: StoreEventMongoModel): Observable<StoreEventMongoModel> {
    return this.storedEventMongoRepository.storeEvent(entity);
  }
}
