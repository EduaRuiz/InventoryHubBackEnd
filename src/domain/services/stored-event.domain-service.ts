import { StoredEventDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface IStoredEventDomainService<
  Entity extends StoredEventDomainModel = StoredEventDomainModel,
> {
  getStoredEvent(id: string): Observable<Entity>;
  deleteStoredEvent(id: string): Observable<Entity>;
  createStoredEvent(storedEvent: Entity): Observable<Entity>;
  updateStoredEvent(storedEvent: Entity): Observable<Entity>;
  getAllStoredEvents(): Observable<Entity[]>;
}
