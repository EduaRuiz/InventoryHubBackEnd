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
import { ProductDomainModel } from '@domain-models';
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
  UnauthorizedSwagger,
} from '@domain/swagger-types';

@ApiTags('Product query api')
@ApiBearerAuth('JWT')
@Controller('api/v1')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({
    summary: 'Get product by id',
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
  @Get('product/:id')
  getProduct(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @ApiOperation({
    summary: 'Get all products',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [ProductSwaggerType],
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
  @Get('products/:branchId')
  getAllProductsByBranch(
    @Param('branchId') branchId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ): Observable<ProductDomainModel[]> {
    return this.productService.getAllProductsByBranchId(
      branchId,
      page,
      pageSize,
    );
  }
}
