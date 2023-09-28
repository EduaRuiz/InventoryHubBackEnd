import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from '../persistence/services';
import { CustomerSaleDto, NewProductDto, SellerSaleDto } from '../utils/dtos';
import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {} from 'src/application/use-cases/product';
import { AddProductDto } from '../utils/dtos';
import { ProductDelegator } from '@use-cases/product';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productDelegator: ProductDelegator,
  ) {}

  @Get('info/:id')
  getProductInfo(
    @Param('id') productId: string,
  ): Observable<ProductDomainModel> {
    return this.productService.getProductById(productId);
  }
  @Post('register')
  createProduct(
    @Body() product: NewProductDto,
  ): Observable<ProductDomainModel> {
    // return this.productRegisterUseCase.execute(product);
    this.productDelegator.toProductRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @Patch('purchase')
  productPurchase(
    @Body() product: AddProductDto,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductPurchaseRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @Patch('sale/seller')
  productSellerSale(
    @Body() sale: SellerSaleDto,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toSellerSaleUseCase();
    return this.productDelegator.execute(sale);
  }

  @Patch('sale/customer')
  productCustomerSale(
    @Body() sale: CustomerSaleDto,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toCustomerSaleUseCase();
    return this.productDelegator.execute(sale);
  }

  @Get('all')
  getAllProducts(): Observable<ProductDomainModel[]> {
    return this.productService.getAllProducts();
  }
}
