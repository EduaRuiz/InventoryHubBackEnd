import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import { PersistenceModule, EventService } from './infrastructure/persistence';
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
        storeEventService: EventService,
        eventPublisher: EventPublisher,
      ) => new ProductDelegator(storeEventService, eventPublisher),
      inject: [EventService, EventPublisher],
    },
    {
      provide: BranchRegisterUseCase,
      useFactory: (
        storeService: EventService,
        eventPublisher: EventPublisher,
      ) => new BranchRegisterUseCase(storeService, eventPublisher),
      inject: [EventService, EventPublisher],
    },
    {
      provide: UserRegisterUseCase,
      useFactory: (
        storeService: EventService,
        eventPublisher: EventPublisher,
      ) => new UserRegisterUseCase(storeService, eventPublisher),
      inject: [EventService, EventPublisher],
    },
  ],
})
export class AppModule {}
