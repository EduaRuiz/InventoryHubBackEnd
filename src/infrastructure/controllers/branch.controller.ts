import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BranchService } from '../persistence/services';
import { BranchDomainModel } from '@domain-models';
import { BranchRegisterUseCase } from 'src/application/use-cases/branch';
import { Observable } from 'rxjs';
import { NewBranchCommand } from '../utils/commands';

@Controller('api/v1/branch')
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly branchRegisterUseCase: BranchRegisterUseCase,
  ) {}

  @Post('register')
  registerBranch(
    @Body() branch: NewBranchCommand,
  ): Observable<BranchDomainModel> {
    return this.branchRegisterUseCase.execute(branch);
  }

  @Get(':id')
  getBranchInfo(@Param('id') branchId: string): Observable<BranchDomainModel> {
    return this.branchService.getBranchById(branchId);
  }

  @Get('all/all')
  getAllBranches(): Observable<BranchDomainModel[]> {
    return this.branchService.getAllBranches();
  }
}
