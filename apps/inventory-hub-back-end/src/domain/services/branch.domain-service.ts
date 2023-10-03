import { BranchDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export interface IBranchDomainService<
  Entity extends BranchDomainModel = BranchDomainModel,
> {
  getBranch(id: string): Observable<Entity>;
  deleteBranch(id: string): Observable<Entity>;
  createBranch(branch: Entity): Observable<Entity>;
  updateBranch(branch: Entity): Observable<Entity>;
  getAllBranches(): Observable<Entity[]>;
}
