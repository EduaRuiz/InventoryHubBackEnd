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

@Controller('api/v1')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('sale/:id')
  getSale(@Param('id') id: string) {
    return this.saleService.getSaleById(id);
  }

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
