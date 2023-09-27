import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import {
  ProductService,
  BranchService,
  UserService,
} from '../persistence/services';
import { CustomerSaleDto, NewProductDto, SellerSaleDto } from '../utils/dtos';
import { ProductDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {
  RegisterCustomerSaleUseCase,
  RegisterProductQuantityUseCase,
  RegisterProductUseCase,
  RegisterSellerSaleUseCase,
} from 'src/application/use-cases/product';
import { AddProductDto } from '../utils/dtos/add-product.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly branchService: BranchService,
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
    const newProduct = new RegisterProductUseCase(
      this.productService,
      // this.registeredNewProductPublisher,
    );
    return newProduct.execute(product);
  }

  @Patch('purchase')
  productPurchase(
    @Body() product: AddProductDto,
  ): Observable<ProductDomainModel> {
    const newProduct = new RegisterProductQuantityUseCase(
      this.productService,
      // this.registeredNewProductPublisher,
    );
    return newProduct.execute(product);
  }

  @Patch('sale/seller')
  productSellerSale(
    @Body() sale: SellerSaleDto,
  ): Observable<ProductDomainModel> {
    const newProduct = new RegisterSellerSaleUseCase(
      this.productService,
      // this.registeredNewProductPublisher,
    );
    return newProduct.execute(sale);
  }

  @Patch('sale/customer')
  productCustomerSale(
    @Body() sale: CustomerSaleDto,
  ): Observable<ProductDomainModel> {
    const newProduct = new RegisterCustomerSaleUseCase(
      this.productService,
      // this.registeredNewProductPublisher,
    );
    return newProduct.execute(sale);
  }
}
