import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import {
  BranchService,
  PersistenceModule,
  ProductService,
  UserService,
} from './infrastructure/persistence';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import {
  BranchRegisteredPublisher,
  CustomerSaleRegisteredPublisher,
  MessagingModule,
  ProductPurchaseRegisteredPublisher,
  ProductRegisteredPublisher,
  SellerSaleRegisteredPublisher,
  UserRegisteredPublisher,
} from './infrastructure/messaging';
import { BranchRegisterUseCase, UserRegisterUseCase } from '@use-cases';
import { ProductDelegator } from '@use-cases/product';

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
        productService: ProductService,
        productRegisteredEvent: ProductRegisteredPublisher,
        productPurchaseRegisteredEvent: ProductPurchaseRegisteredPublisher,
        sellerSaleRegisteredEvent: SellerSaleRegisteredPublisher,
        customerSaleRegisteredEvent: CustomerSaleRegisteredPublisher,
      ) =>
        new ProductDelegator(
          productService,
          productRegisteredEvent,
          productPurchaseRegisteredEvent,
          sellerSaleRegisteredEvent,
          customerSaleRegisteredEvent,
        ),
      inject: [
        ProductService,
        ProductRegisteredPublisher,
        ProductPurchaseRegisteredPublisher,
        SellerSaleRegisteredPublisher,
        CustomerSaleRegisteredPublisher,
      ],
    },
    {
      provide: BranchRegisterUseCase,
      useFactory: (
        branchService: BranchService,
        branchRegisteredEvent: BranchRegisteredPublisher,
      ) => new BranchRegisterUseCase(branchService, branchRegisteredEvent),
      inject: [BranchService, BranchRegisteredPublisher],
    },
    {
      provide: UserRegisterUseCase,
      useFactory: (
        userService: UserService,
        userRegisteredEvent: UserRegisteredPublisher,
      ) => new UserRegisterUseCase(userService, userRegisteredEvent),
      inject: [UserService, UserRegisteredPublisher],
    },
  ],
})
export class AppModule {}
