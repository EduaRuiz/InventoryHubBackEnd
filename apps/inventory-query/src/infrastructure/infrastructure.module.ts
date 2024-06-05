import { Module } from '@nestjs/common';
import {
  BranchService,
  PersistenceModule,
  ProductService,
  SaleService,
  UserService,
} from './persistence';
import { MailService } from './utils/services';
import {
  BranchRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  ProductUpdatedUseCase,
  SaleRegisteredUseCase,
  UserRegisteredUseCase,
} from '@use-cases-query';
import {
  BranchListener,
  ProductListener,
  RabbitMQConfigService,
  UserListener,
} from './listeners';
import {
  BranchController,
  ProductController,
  SaleController,
  UserController,
} from './controllers';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService, JwtStrategy } from './utils/strategies';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PersistenceModule,
  ],
  controllers: [
    ProductController,
    SaleController,
    BranchController,
    UserController,
  ],
  providers: [
    RabbitMQConfigService,
    MailService,
    BranchListener,
    ProductListener,
    UserListener,
    JwtStrategy,
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
  ],
  exports: [PersistenceModule, RabbitMQConfigService],
})
export class InfrastructureModule {}
