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
import { SaleDomainModel } from '@domain-models/sale.domain-model';

@Controller('api/v1/invoice')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get(':id')
  getSale(@Param('id') id: string) {
    return this.saleService.getSaleById(id);
  }

  @Get('all/:branchId')
  getAllSalesByBranch(
    @Param('branchId') branchId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
  ): Observable<SaleDomainModel[]> {
    return this.saleService.getAllSalesByBranchId(branchId, page, pageSize);
  }
}
