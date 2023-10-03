import { Module } from '@nestjs/common';
import { PostgresModule } from './databases/postgres/postgres.module';
import {
  UserService,
  ProductService,
  BranchService,
  StoreEventService,
} from './services';
import { MongoModule } from './databases/mongo';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [PostgresModule, MongoModule],
  controllers: [],
  providers: [UserService, ProductService, BranchService, StoreEventService],
  exports: [UserService, ProductService, BranchService, StoreEventService],
})
export class PersistenceModule {}
