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
import {
  BranchService,
  PersistenceModule,
  ProductService,
  UserService,
} from './infrastructure/persistence';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ProductController } from './infrastructure/controllers/product.controller';

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
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    PersistenceModule,
  ],
  controllers: [
    BranchListener,
    ProductListener,
    UserListener,
    ProductController,
  ],
  providers: [
    {
      provide: ProductRegisteredUseCase,
      useFactory: (productService: ProductService) =>
        new ProductRegisteredUseCase(productService),
      inject: [ProductService],
    },
    {
      provide: ProductPurchaseRegisteredUseCase,
      useFactory: (productService: ProductService) =>
        new ProductPurchaseRegisteredUseCase(productService),
      inject: [ProductService],
    },
    {
      provide: CustomerSaleRegisteredUseCase,
      useFactory: (productService: ProductService) =>
        new CustomerSaleRegisteredUseCase(productService),
      inject: [ProductService],
    },
    {
      provide: SellerSaleRegisteredUseCase,
      useFactory: (productService: ProductService) =>
        new SellerSaleRegisteredUseCase(productService),
      inject: [ProductService],
    },
    {
      provide: BranchRegisteredUseCase,
      useFactory: (branchService: BranchService) =>
        new BranchRegisteredUseCase(branchService),
      inject: [BranchService],
    },
    {
      provide: UserRegisteredUseCase,
      useFactory: (userService: UserService) =>
        new UserRegisteredUseCase(userService),
      inject: [UserService],
    },
    BranchListener,
    ProductListener,
    UserListener,
  ],
})
export class EventConsumerModule {}
