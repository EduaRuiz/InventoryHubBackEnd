import { SaleDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface ISaleDomainService<
  Entity extends SaleDomainModel = SaleDomainModel,
> {
  getSale(id: string): Observable<Entity>;
  deleteSale(id: string): Observable<Entity>;
  createSale(branch: Entity): Observable<Entity>;
  updateSale(branch: Entity): Observable<Entity>;
  getAllSales(page: number, pageSize: number): Observable<Entity[]>;
  getAllSalesByBranchId(
    branchId: string,
    page: number,
    pageSize: number,
  ): Observable<Entity[]>;
}
