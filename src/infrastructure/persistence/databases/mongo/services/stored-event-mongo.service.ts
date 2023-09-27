import { Observable } from 'rxjs';
import { StoredEventMongoModel } from '../models';
import { IStoredEventDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { StoredEventMongoRepository } from '../repositories';

@Injectable()
export class StoredEventMongoService
  implements IStoredEventDomainService<StoredEventMongoModel>
{
  constructor(
    private readonly storedEventMongoRepository: StoredEventMongoRepository,
  ) {}

  getStoredEvent(id: string): Observable<StoredEventMongoModel> {
    return this.storedEventMongoRepository.findOneById(id);
  }

  deleteStoredEvent(id: string): Observable<StoredEventMongoModel> {
    return this.storedEventMongoRepository.delete(id);
  }

  updateStoredEvent(
    storedEvent: StoredEventMongoModel,
  ): Observable<StoredEventMongoModel> {
    return this.storedEventMongoRepository.update(
      storedEvent._id ?? '0',
      storedEvent,
    );
  }

  getAllStoredEvents(): Observable<StoredEventMongoModel[]> {
    return this.storedEventMongoRepository.findAll();
  }

  createStoredEvent(
    entity: StoredEventMongoModel,
  ): Observable<StoredEventMongoModel> {
    return this.storedEventMongoRepository.create(entity);
  }
}
