import { EventDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import { TypeNameEnum } from '@enums';

export interface IEventDomainService<
  Entity extends EventDomainModel = EventDomainModel,
> {
  getEvent(id: string): Observable<Entity>;
  getEventByAggregateRootId(id: string): Observable<Entity>;
  storeEvent(event: Entity): Observable<Entity>;
  getAllEvents(): Observable<Entity[]>;
  entityAlreadyExist(
    key: string,
    value: string,
    aggregateRootId?: string,
  ): Observable<boolean>;
  getLastEventByEntityId(
    entityId: string,
    typeName: TypeNameEnum[],
    aggregateRootId?: string,
  ): Observable<Entity>;
  generateIncrementalSaleId(
    aggregateRootId: string,
    typeName: TypeNameEnum[],
  ): Observable<number>;
}
