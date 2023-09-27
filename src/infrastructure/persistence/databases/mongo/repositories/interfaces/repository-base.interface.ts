import { Observable } from 'rxjs';

/**
 * Interfaz base para los repositorios
 *
 * @export
 * @interface IRepositoryBase
 * @template Entity
 */
export interface IRepositoryBase<Entity> {
  /**
   * Crea un nuevo registro
   *
   * @param {Entity} entity Datos del registro
   * @return  {Observable<Entity>} Observable con los datos del registro
   * @memberof IRepositoryBase
   */
  create(entity: Entity): Observable<Entity>;
  /**
   * Actualiza un registro
   *
   * @param {string} entityId Identificador del registro
   * @param {Entity} entity Datos del registro
   * @return  {Observable<Entity>} Observable con los datos del registro
   * @memberof IRepositoryBase
   */
  update(entityId: string, entity: Entity): Observable<Entity>;
  /**
   * Elimina un registro
   *
   * @param {string} entityId Identificador del registro
   * @return  {Observable<Entity>} Observable con los datos del registro
   * @memberof IRepositoryBase
   */
  delete(entityId: string): Observable<Entity>;
  /**
   * Obtiene todos los registros
   *
   * @return {Observable<Entity[]>} Observable con los datos de los registros
   * @memberof IRepositoryBase
   */
  findAll(): Observable<Entity[]>;
  /**
   * Obtiene un registro por su identificador
   *
   * @param {string} entityId Identificador del registro
   * @return  {Observable<Entity>} Observable con los datos del registro
   * @memberof IRepositoryBase
   */
  findOneById(entityId: string): Observable<Entity>;
}
