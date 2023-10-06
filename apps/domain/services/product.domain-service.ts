import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface IProductDomainService<
  Entity extends ProductDomainModel = ProductDomainModel,
> {
  getProduct(id: string): Observable<Entity>;
  deleteProduct(id: string): Observable<Entity>;
  createProduct(product: Entity): Observable<Entity>;
  updateProduct(product: Entity): Observable<Entity>;
  getAllProducts(): Observable<Entity[]>;
  getAllProductsByBranchId(
    branchId: string,
    page: number,
    pageSize: number,
  ): Observable<Entity[]>;
}
