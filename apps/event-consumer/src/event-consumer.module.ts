import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  BranchRegisteredUseCase,
  CustomerSaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  SellerSaleRegisteredUseCase,
  UserRegisteredUseCase,
} from '@use-cases-con';
import {
  BranchListener,
  ProductListener,
  UserListener,
} from './infrastructure/listeners';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [BranchListener, ProductListener, UserListener],
  providers: [
    {
      provide: ProductRegisteredUseCase,
      useFactory: () => new ProductRegisteredUseCase(),
      inject: [],
    },
    {
      provide: ProductPurchaseRegisteredUseCase,
      useFactory: () => new ProductPurchaseRegisteredUseCase(),
      inject: [],
    },
    {
      provide: CustomerSaleRegisteredUseCase,
      useFactory: () => new CustomerSaleRegisteredUseCase(),
      inject: [],
    },
    {
      provide: SellerSaleRegisteredUseCase,
      useFactory: () => new SellerSaleRegisteredUseCase(),
      inject: [],
    },
    {
      provide: BranchRegisteredUseCase,
      useFactory: () => new BranchRegisteredUseCase(),
      inject: [],
    },
    {
      provide: UserRegisteredUseCase,
      useFactory: () => new UserRegisteredUseCase(),
      inject: [],
    },
    BranchListener,
    ProductListener,
    UserListener,
  ],
})
export class EventConsumerModule {}
