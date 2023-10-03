import { EventDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface IStoreEventDomainService<
  Entity extends EventDomainModel = EventDomainModel,
> {
  getEvent(id: string): Observable<Entity>;
  deleteEvent(id: string): Observable<Entity>;
  createEvent(event: Entity): Observable<Entity>;
  updateEvent(event: Entity): Observable<Entity>;
  getAllEvents(): Observable<Entity[]>;

  storeProductRegistered(event: Entity): Observable<Entity>;
  storeUserRegistered(event: Entity): Observable<Entity>;
  storeBranchRegistered(event: Entity): Observable<Entity>;
  storeSellerSaleRegistered(event: Entity): Observable<Entity>;
  storeCustomerSaleRegistered(event: Entity): Observable<Entity>;
  storeProductPurchaseRegistered(event: Entity): Observable<Entity>;
}
