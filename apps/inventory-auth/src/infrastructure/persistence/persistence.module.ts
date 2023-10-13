import { Module } from '@nestjs/common';
import { PostgresModule } from './databases/postgres/postgres.module';
import { UserService } from './services';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [PostgresModule],
  controllers: [],
  providers: [UserService],
  exports: [UserService],
})
export class PersistenceModule {}
