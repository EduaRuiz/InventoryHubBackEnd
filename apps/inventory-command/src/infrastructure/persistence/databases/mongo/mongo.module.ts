import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreEventMongoModel, StoredEventSchema } from './models';
import { StoreEventMongoRepository } from './repositories';
import { EventMongoService } from './services';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature([
      { name: StoreEventMongoModel.name, schema: StoredEventSchema },
    ]),
  ],
  controllers: [],
  providers: [
    MongooseConfigService,
    StoreEventMongoRepository,
    EventMongoService,
  ],
  exports: [StoreEventMongoRepository, EventMongoService],
})
export class MongoModule {}
