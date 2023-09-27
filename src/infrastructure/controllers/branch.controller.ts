import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BranchService } from '../persistence/services';
import { BranchDomainModel } from '@domain-models';
import { BranchRegisterUseCase } from 'src/application/use-cases/branch';
import { Observable } from 'rxjs';
import { NewBranchDto } from '../utils/dtos';

@Controller('branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly branchRegisterUseCase: BranchRegisterUseCase,
  ) {}

  @Post('register')
  registerBranch(@Body() branch: NewBranchDto): Observable<BranchDomainModel> {
    return this.branchRegisterUseCase.execute(branch);
  }

  @Get('info/:id')
  getBranchInfo(@Param('id') branchId: string): Observable<BranchDomainModel> {
    return this.branchService.getBranchById(branchId);
  }
}
