import { Injectable } from '@nestjs/common';
import { SalePostgresRepository } from '../repositories';
import { SalePostgresEntity } from '../entities';
import { Observable } from 'rxjs';
import { ISaleDomainService } from '@domain-services';

@Injectable()
export class SalePostgresService
  implements ISaleDomainService<SalePostgresEntity>
{
  constructor(
    private readonly branchPostgresRepository: SalePostgresRepository,
  ) {}
  getAllSales(): Observable<SalePostgresEntity[]> {
    return this.branchPostgresRepository.findAll();
  }

  getSaleById(id: string): Observable<SalePostgresEntity> {
    return this.branchPostgresRepository.findOneById(id);
  }

  deleteSale(id: string): Observable<SalePostgresEntity> {
    return this.branchPostgresRepository.delete(id);
  }

  createSale(branch: SalePostgresEntity): Observable<SalePostgresEntity> {
    return this.branchPostgresRepository.create(branch);
  }

  updateSale(branch: SalePostgresEntity): Observable<SalePostgresEntity> {
    return this.branchPostgresRepository.update(branch.id, branch);
  }

  getSale(id: string): Observable<SalePostgresEntity> {
    return this.branchPostgresRepository.findOneById(id);
  }
}
