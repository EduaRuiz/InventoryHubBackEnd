import { Body, Controller, Patch, Post } from '@nestjs/common';
import {
  CustomerSaleCommand,
  NewProductCommand,
  SellerSaleCommand,
} from '../utils/commands';
import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {} from '@use-cases-inv/product';
import { AddProductCommand } from '../utils/commands';
import { ProductDelegator } from '@use-cases-inv/product';

@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productDelegator: ProductDelegator) {}

  @Post('register')
  createProduct(
    @Body() product: NewProductCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @Patch('purchase')
  productPurchase(
    @Body() product: AddProductCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductPurchaseRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @Patch('seller-sale')
  productSellerSale(
    @Body() sale: SellerSaleCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toSellerSaleUseCase();
    return this.productDelegator.execute(sale, '');
  }

  @Patch('customer-sale')
  productCustomerSale(
    @Body() sale: CustomerSaleCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toCustomerSaleUseCase();
    return this.productDelegator.execute(sale, 'd');
  }
}
