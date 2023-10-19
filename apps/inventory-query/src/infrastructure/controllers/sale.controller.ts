import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { SaleService } from '../persistence';
import { Observable } from 'rxjs';
import { SaleDomainModel } from '@domain-models';
import { UserRoleEnum } from '@enums';
import { Auth } from '../utils/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConflictSwagger,
  NotFoundSwagger,
  SaleSwaggerType,
  UnauthorizedSwagger,
} from '@domain/swagger-types';

@ApiTags('Sale query api')
@ApiBearerAuth('JWT')
@Controller('api/v1')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @ApiOperation({
    summary: 'Get sale by id',
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
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('sale/:id')
  getSale(@Param('id') id: string) {
    return this.saleService.getSaleById(id);
  }

  @ApiOperation({
    summary: 'Get all sales',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [SaleSwaggerType],
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
  @Auth(UserRoleEnum.EMPLOYEE, UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('sales/:branchId')
  getAllSalesByBranch(
    @Param('branchId') branchId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(100), ParseIntPipe)
    pageSize: number,
  ): Observable<SaleDomainModel[]> {
    return this.saleService.getAllSalesByBranchId(branchId, page, pageSize);
  }
}
