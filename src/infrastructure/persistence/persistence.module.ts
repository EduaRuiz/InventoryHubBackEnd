import { Module } from '@nestjs/common';
import { PostgresModule } from './databases/postgres/postgres.module';
import {
  UserService,
  ProductService,
  BranchService,
  StoredEventService,
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
  providers: [UserService, ProductService, BranchService, StoredEventService],
  exports: [UserService, ProductService, BranchService, StoredEventService],
})
export class PersistenceModule {}
