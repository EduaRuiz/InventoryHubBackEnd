import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductService } from '../persistence/services';
import { CustomerSaleDto, NewProductDto, SellerSaleDto } from '../utils/dtos';
import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {
  CustomerSaleRegisterUseCase,
  ProductPurchaseRegisterUseCase,
  ProductRegisterUseCase,
  SellerSaleRegisterUseCase,
} from 'src/application/use-cases/product';
import { AddProductDto } from '../utils/dtos';
// import { ProductRegisteredPublisher } from '../messaging/publishers';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productRegisterUseCase: ProductRegisterUseCase,
    private readonly productPurchaseRegisterUseCase: ProductPurchaseRegisterUseCase,
    private readonly sellerSaleRegisterUseCase: SellerSaleRegisterUseCase,
    private readonly customerSaleRegisterUseCase: CustomerSaleRegisterUseCase,
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
    return this.productRegisterUseCase.execute(product);
  }

  @Patch('purchase')
  productPurchase(
    @Body() product: AddProductDto,
  ): Observable<ProductDomainModel> {
    return this.productPurchaseRegisterUseCase.execute(product);
  }

  @Patch('sale/seller')
  productSellerSale(
    @Body() sale: SellerSaleDto,
  ): Observable<ProductDomainModel> {
    return this.sellerSaleRegisterUseCase.execute(sale);
  }

  @Patch('sale/customer')
  productCustomerSale(
    @Body() sale: CustomerSaleDto,
  ): Observable<ProductDomainModel> {
    return this.customerSaleRegisterUseCase.execute(sale);
  }
}
