import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import {
  CustomerSaleCommand,
  NewProductCommand,
  SellerSaleCommand,
} from '../utils/commands';
import { ProductDomainModel, SaleDomainModel } from '@domain-models';
import { Observable } from 'rxjs';
import {} from '@use-cases-command/product';
import { AddProductCommand } from '../utils/commands';
import { ProductDelegator } from '@use-cases-command/product';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConflictSwagger,
  NotFoundSwagger,
  ProductSwaggerType,
  SaleSwaggerType,
  UnauthorizedSwagger,
} from '@domain/swagger-types';

@ApiTags('Command product api')
@ApiBearerAuth('JWT')
@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productDelegator: ProductDelegator) {}

  @ApiOperation({
    summary: 'Register product',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductSwaggerType,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ConflictSwagger,
  })
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Post('register')
  createProduct(
    @Body() product: NewProductCommand,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductRegisterUseCase();
    return this.productDelegator.execute(product);
  }

  @ApiOperation({
    summary: 'Purchase product',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: ProductSwaggerType,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ConflictSwagger,
  })
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('purchase/:id')
  productPurchase(
    @Body() product: AddProductCommand,
    @Param('id') id: string,
  ): Observable<ProductDomainModel> {
    this.productDelegator.toProductPurchaseRegisterUseCase();
    return this.productDelegator.execute(product, id);
  }

  @ApiOperation({
    summary: 'Seller sale product',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SaleSwaggerType,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ConflictSwagger,
  })
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('seller-sale')
  productSellerSale(
    @Body() sale: SellerSaleCommand,
  ): Observable<SaleDomainModel> {
    this.productDelegator.toSellerSaleUseCase();
    return this.productDelegator.execute(sale, sale.userId);
  }

  @ApiOperation({
    summary: 'Customer sale product',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: SaleSwaggerType,
  })
  @ApiResponse({
    status: 404,
    description: 'Record not found',
    type: NotFoundSwagger,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    type: UnauthorizedSwagger,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    type: ConflictSwagger,
  })
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Patch('customer-sale')
  productCustomerSale(
    @Body() sale: CustomerSaleCommand,
  ): Observable<SaleDomainModel> {
    this.productDelegator.toCustomerSaleUseCase();
    return this.productDelegator.execute(sale, sale.userId);
  }
}
