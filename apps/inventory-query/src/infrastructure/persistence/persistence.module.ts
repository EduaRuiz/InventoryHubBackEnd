import { Module } from '@nestjs/common';
import { PostgresModule } from './databases/postgres/postgres.module';
import {
  UserService,
  ProductService,
  BranchService,
  SaleService,
} from './services';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [PostgresModule],
  controllers: [],
  providers: [UserService, ProductService, BranchService, SaleService],
  exports: [UserService, ProductService, BranchService, SaleService],
})
export class PersistenceModule {}
