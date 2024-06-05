import { Module } from '@nestjs/common';
import {
  BranchRegisteredUseCase,
  SaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  ProductUpdatedUseCase,
  UserRegisteredUseCase,
} from '@use-cases-query';
import {
  BranchListener,
  ProductListener,
  UserListener,
} from './infrastructure/listeners';
import {
  BranchService,
  ProductService,
  SaleService,
  UserService,
} from './infrastructure/persistence';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import {
  BranchController,
  ProductController,
  SaleController,
  UserController,
} from './infrastructure/controllers';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { MailService } from './infrastructure/utils/services';

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
    InfrastructureModule,
  ],
  controllers: [
    ProductController,
    SaleController,
    BranchController,
    UserController,
    BranchListener,
    ProductListener,
    UserListener,
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
      provide: SaleRegisteredUseCase,
      useFactory: (
        saleService: SaleService,
        productService: ProductService,
        userService: UserService,
        mailService: MailService,
      ) =>
        new SaleRegisteredUseCase(
          saleService,
          productService,
          userService,
          mailService,
        ),
      inject: [SaleService, ProductService, UserService, MailService],
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
export class InventoryQueryModule {}
