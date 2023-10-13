import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from '../persistence';
import { Observable } from 'rxjs';
import { ProductDomainModel } from '@domain-models/product.domain-model';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';

@Controller('api/v1')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Get('product/:id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.EMPLOYEE, UserRoleEnum.SUPER_ADMIN)
  @Get('products/:branchId')
  getAllProductsByBranch(
    @Param('branchId') branchId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Observable<ProductDomainModel[]> {
    return this.productService.getAllProductsByBranchId(
      branchId,
      page,
      pageSize,
    );
  }
}
