import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreEventMongoModel, StoredEventSchema } from './models';
import { StoreEventMongoRepository } from './repositories';
import { StoreEventMongoService } from './services';

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
    StoreEventMongoService,
  ],
  exports: [StoreEventMongoRepository, StoreEventMongoService],
})
export class MongoModule {}
