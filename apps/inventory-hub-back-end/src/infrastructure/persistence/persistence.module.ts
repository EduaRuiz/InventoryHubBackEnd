import { Module } from '@nestjs/common';
import { EventService } from './services';
import { MongoModule } from './databases/mongo';

/**
 * Modulo de persistencia
 *
 * @export
 * @class PersistenceModule
 */
@Module({
  imports: [MongoModule],
  controllers: [],
  providers: [EventService],
  exports: [EventService],
})
export class PersistenceModule {}
