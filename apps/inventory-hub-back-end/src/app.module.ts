import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import {
  PersistenceModule,
  StoreEventService,
} from './infrastructure/persistence';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { MessagingModule } from './infrastructure/messaging';
import { BranchRegisterUseCase, UserRegisterUseCase } from '@use-cases-inv';
import { ProductDelegator } from '@use-cases-inv/product';
import { EventPublisher } from './infrastructure/messaging/publishers/event.publisher';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        'environments',
        `.env.${process.env.SCOPE?.trimEnd()}`,
      ),
    }),
    PersistenceModule,
    MessagingModule,
    // HttpModule,
  ],
  controllers: [UserController, BranchController, ProductController],
  providers: [
    {
      provide: ProductDelegator,
      useFactory: (
        storeEventService: StoreEventService,
        eventPublisher: EventPublisher,
      ) => new ProductDelegator(storeEventService, eventPublisher),
      inject: [StoreEventService, EventPublisher],
    },
    {
      provide: BranchRegisterUseCase,
      useFactory: (
        storeService: StoreEventService,
        eventPublisher: EventPublisher,
      ) => new BranchRegisterUseCase(storeService, eventPublisher),
      inject: [StoreEventService, EventPublisher],
    },
    {
      provide: UserRegisterUseCase,
      useFactory: (
        storeService: StoreEventService,
        eventPublisher: EventPublisher,
      ) => new UserRegisterUseCase(storeService, eventPublisher),
      inject: [StoreEventService, EventPublisher],
    },
  ],
})
export class AppModule {}
