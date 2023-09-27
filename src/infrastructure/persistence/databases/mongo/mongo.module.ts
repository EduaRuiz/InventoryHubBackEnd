import { Module } from '@nestjs/common';
import { MongooseConfigService } from './configs';
import { MongooseModule } from '@nestjs/mongoose';
import { StoredEventMongoModel, StoredEventSchema } from './models';
import { StoredEventMongoRepository } from './repositories';
import { StoredEventMongoService } from './services';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    // MongooseModule.forRoot(
    //   'mongodb://root:password@localhost:27017/inventory?authSource=admin',
    // ),
    MongooseModule.forFeature([
      { name: StoredEventMongoModel.name, schema: StoredEventSchema },
      {
        name: StoredEventMongoModel.name,
        schema: StoredEventSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [
    MongooseConfigService,
    StoredEventMongoRepository,
    StoredEventMongoService,
  ],
  exports: [StoredEventMongoRepository, StoredEventMongoService],
})
export class MongoModule {}
