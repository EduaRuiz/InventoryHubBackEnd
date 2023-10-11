import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from '../persistence';

@Controller('api/v1/branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get(':id')
  getBranch(@Param('id') id: string) {
    return this.branchService.getBranch(id);
  }

  @Get('get/all')
  getAllBranches() {
    return this.branchService.getAllBranches();
  }
}
