import { Module } from '@nestjs/common';
import { UserController } from './infrastructure/controllers/user.controller';
import { BranchController } from './infrastructure/controllers/branch.controller';
import { ProductController } from './infrastructure/controllers/product.controller';
import {
  BranchService,
  PersistenceModule,
  ProductService,
  StoredEventService,
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
import {
  BranchRegisterUseCase,
  CustomerSaleRegisterUseCase,
  ProductPurchaseRegisterUseCase,
  ProductRegisterUseCase,
  SellerSaleRegisterUseCase,
  UserRegisterUseCase,
} from '@use-cases';

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
      provide: ProductRegisterUseCase,
      useFactory: (
        productService: ProductService,
        storedEventService: StoredEventService,
        productRegisteredEvent: ProductRegisteredPublisher,
      ) =>
        new ProductRegisterUseCase(
          productService,
          storedEventService,
          productRegisteredEvent,
        ),
      inject: [ProductService, StoredEventService, ProductRegisteredPublisher],
    },
    {
      provide: ProductPurchaseRegisterUseCase,
      useFactory: (
        productService: ProductService,
        storedEventService: StoredEventService,
        productRegisteredEvent: ProductPurchaseRegisteredPublisher,
      ) =>
        new ProductPurchaseRegisterUseCase(
          productService,
          storedEventService,
          productRegisteredEvent,
        ),
      inject: [
        ProductService,
        StoredEventService,
        ProductPurchaseRegisteredPublisher,
      ],
    },
    {
      provide: CustomerSaleRegisterUseCase,
      useFactory: (
        productService: ProductService,
        storedEventService: StoredEventService,
        productRegisteredEvent: CustomerSaleRegisteredPublisher,
      ) =>
        new CustomerSaleRegisterUseCase(
          productService,
          storedEventService,
          productRegisteredEvent,
        ),
      inject: [
        ProductService,
        StoredEventService,
        CustomerSaleRegisteredPublisher,
      ],
    },
    {
      provide: SellerSaleRegisterUseCase,
      useFactory: (
        productService: ProductService,
        storedEventService: StoredEventService,
        productRegisteredEvent: SellerSaleRegisteredPublisher,
      ) =>
        new SellerSaleRegisterUseCase(
          productService,
          storedEventService,
          productRegisteredEvent,
        ),
      inject: [
        ProductService,
        StoredEventService,
        SellerSaleRegisteredPublisher,
      ],
    },
    {
      provide: BranchRegisterUseCase,
      useFactory: (
        branchService: BranchService,
        storedEventService: StoredEventService,
        branchRegisteredEvent: BranchRegisteredPublisher,
      ) =>
        new BranchRegisterUseCase(
          branchService,
          storedEventService,
          branchRegisteredEvent,
        ),
      inject: [BranchService, StoredEventService, BranchRegisteredPublisher],
    },
    {
      provide: UserRegisterUseCase,
      useFactory: (
        userService: UserService,
        storedEventService: StoredEventService,
        userRegisteredEvent: UserRegisteredPublisher,
      ) =>
        new UserRegisterUseCase(
          userService,
          storedEventService,
          userRegisteredEvent,
        ),
      inject: [UserService, StoredEventService, UserRegisteredPublisher],
    },
  ],
})
export class AppModule {}
