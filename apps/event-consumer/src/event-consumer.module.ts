import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import {
  BranchRegisteredUseCase,
  CustomerSaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  ProductUpdatedUseCase,
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
  SaleService,
  UserService,
} from './infrastructure/persistence';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import {
  ProductController,
  SaleController,
} from './infrastructure/controllers';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { UserController } from './infrastructure/controllers/user.controller';

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
      uri: process.env.RMQ_URI || 'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    PersistenceModule,
  ],
  controllers: [
    BranchListener,
    ProductListener,
    UserListener,
    ProductController,
    SaleController,
    BranchController,
    UserController,
  ],
  providers: [
    {
      provide: ProductRegisteredUseCase,
      useFactory: (productService: ProductService) =>
        new ProductRegisteredUseCase(productService),
      inject: [ProductService],
    },
    {
      provide: ProductUpdatedUseCase,
      useFactory: (productService: ProductService) =>
        new ProductUpdatedUseCase(productService),
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
      useFactory: (productService: SaleService) =>
        new CustomerSaleRegisteredUseCase(productService),
      inject: [SaleService],
    },
    {
      provide: SellerSaleRegisteredUseCase,
      useFactory: (productService: SaleService) =>
        new SellerSaleRegisteredUseCase(productService),
      inject: [SaleService],
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
