import { Module } from '@nestjs/common';
import {
  BranchController,
  ProductController,
  UserController,
} from './infrastructure/controllers';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import {
  BranchRegisterUseCase,
  UserRegisterUseCase,
  ProductDelegator,
} from '@use-cases-command';
import { EventPublisher } from './infrastructure/messaging/publishers';
import { InfrastructureModule } from './infrastructure';
import { EventService } from './infrastructure/persistence/services';
import { JwtStrategy } from './infrastructure/utils/strategies';
import { MailService } from './infrastructure/utils/services';
import { JoiValidationSchema } from 'environments/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        'environments',
        `.env.${process.env.SCOPE?.trimEnd()}`,
      ),
      validationSchema: JoiValidationSchema,
    }),
    InfrastructureModule,
  ],
  controllers: [UserController, BranchController, ProductController],
  providers: [
    JwtStrategy,
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
        mailService: MailService,
      ) => new UserRegisterUseCase(storeService, eventPublisher, mailService),
      inject: [EventService, EventPublisher, MailService],
    },
  ],
  exports: [],
})
export class InventoryCommandModule {}
