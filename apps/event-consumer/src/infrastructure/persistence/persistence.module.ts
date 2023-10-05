import { Module } from '@nestjs/common';
import { PostgresModule } from './databases/postgres/postgres.module';
import { UserService, ProductService, BranchService } from './services';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [PostgresModule],
  controllers: [],
  providers: [UserService, ProductService, BranchService],
  exports: [UserService, ProductService, BranchService],
})
export class PersistenceModule {}
