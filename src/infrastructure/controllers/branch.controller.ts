import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BranchService } from '../persistence/services';
import { BranchDomainModel } from '@domain-models';
import { RegisterBranchUseCase } from 'src/application/use-cases/branch';
import { Observable } from 'rxjs';
import { NewBranchDto } from '../utils/dtos';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post('register')
  registerBranch(@Body() branch: NewBranchDto): Observable<BranchDomainModel> {
    const newBranch = new RegisterBranchUseCase(
      this.branchService,
      // this.registeredNewBranchPublisher,
    );
    return newBranch.execute(branch);
  }

  @Get('info/:id')
  getBranchInfo(@Param('id') branchId: string): Observable<BranchDomainModel> {
    return this.branchService.getBranchById(branchId);
  }
}
