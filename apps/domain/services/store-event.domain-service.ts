import { EventDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface IStoreEventDomainService<
  Entity extends EventDomainModel = EventDomainModel,
> {
  getEvent(id: string): Observable<Entity>;
  getEventByAggregateRootId(id: string): Observable<Entity>;
  createEvent(event: Entity): Observable<Entity>;
  storeEvent(event: Entity): Observable<Entity>;
  getAllEvents(): Observable<Entity[]>;

  getLastEventByIdEventBody(idEventBody: string): Observable<Entity>;

  storeEventUpdate(event: Entity): Observable<Entity>;
}
