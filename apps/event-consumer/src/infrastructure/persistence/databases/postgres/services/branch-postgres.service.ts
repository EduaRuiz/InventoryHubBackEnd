import { Injectable } from '@nestjs/common';
import { BranchPostgresRepository } from '../repositories';
import { BranchPostgresEntity } from '../entities';
import { Observable } from 'rxjs';
import { IBranchDomainService } from '@domain-services';

@Injectable()
export class BranchPostgresService
  implements IBranchDomainService<BranchPostgresEntity>
{
  constructor(
    private readonly branchPostgresRepository: BranchPostgresRepository,
  ) {}
  getAllBranches(): Observable<BranchPostgresEntity[]> {
    return this.branchPostgresRepository.findAll();
  }

  getBranchById(id: string): Observable<BranchPostgresEntity> {
    return this.branchPostgresRepository.findOneById(id);
  }

  deleteBranch(id: string): Observable<BranchPostgresEntity> {
    return this.branchPostgresRepository.delete(id);
  }

  createBranch(branch: BranchPostgresEntity): Observable<BranchPostgresEntity> {
    return this.branchPostgresRepository.create(branch);
  }

  updateBranch(branch: BranchPostgresEntity): Observable<BranchPostgresEntity> {
    return this.branchPostgresRepository.update(branch.id, branch);
  }

  getBranch(id: string): Observable<BranchPostgresEntity> {
    return this.branchPostgresRepository.findOneById(id);
  }
}
