import { Injectable } from '@nestjs/common';
import { ProductPostgresRepository } from '../repositories';
import { ProductPostgresEntity } from '../entities';
import { Observable } from 'rxjs';
import { IProductDomainService } from '@domain-services';

@Injectable()
export class ProductPostgresService
  implements IProductDomainService<ProductPostgresEntity>
{
  constructor(
    private readonly productPostgresRepository: ProductPostgresRepository,
  ) {}
  getProductByName(
    name: string,
    branchId: string,
  ): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.findOneByName(name, branchId);
  }
  getProductById(id: string): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.findOneById(id);
  }

  getAllProducts(): Observable<ProductPostgresEntity[]> {
    return this.productPostgresRepository.findAll();
  }

  getAllProductsByBranchId(
    branchId: string,
    page: number,
    pageSize: number,
  ): Observable<ProductPostgresEntity[]> {
    return this.productPostgresRepository.findAllByBranchId(
      branchId,
      page,
      pageSize,
    );
  }

  deleteProduct(id: string): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.delete(id);
  }

  createProduct(
    product: ProductPostgresEntity,
  ): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.create(product);
  }

  updateProduct(
    product: ProductPostgresEntity,
  ): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.update(product.id, product);
  }

  getProduct(id: string): Observable<ProductPostgresEntity> {
    return this.productPostgresRepository.findOneById(id);
  }
}
