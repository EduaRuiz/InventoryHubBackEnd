import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import {
  CustomerSaleCommand,
  NewProductCommand,
  SellerSaleCommand,
} from '../utils/commands';
import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {} from '@use-cases-command/product';
import { AddProductCommand } from '../utils/commands';
import { ProductDelegator } from '@use-cases-command/product';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productDelegator: ProductDelegator) {}
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Post('register')
  createProduct(
    @Body() product: NewProductCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('purchase/:id')
  productPurchase(
    @Body() product: AddProductCommand,
    @Param('id') id: string,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductPurchaseRegisterUseCase();
    return this.productDelegator.execute(product, id);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('seller-sale')
  productSellerSale(
    @Body() sale: SellerSaleCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toSellerSaleUseCase();
    return this.productDelegator.execute(sale, sale.userId);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('customer-sale')
  productCustomerSale(
    @Body() sale: CustomerSaleCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toCustomerSaleUseCase();
    return this.productDelegator.execute(sale, sale.userId);
  }
}
