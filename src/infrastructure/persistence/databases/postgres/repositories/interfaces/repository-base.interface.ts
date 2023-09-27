import { Observable } from 'rxjs';

export interface IRepositoryBaseInterface<Entity> {
  create(entity: Entity): Observable<Entity>;
  update(entityId: string, entity: Entity): Observable<Entity>;
  delete(entityId: string): Observable<Entity>;
  findAll(): Observable<Entity[]>;
  findOneById(entityId: string): Observable<Entity>;
}
