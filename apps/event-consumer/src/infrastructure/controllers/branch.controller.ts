import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from '../persistence';

@Controller('api/v1/branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get(':id')
  getBranch(@Param('id') id: string) {
    return this.branchService.getBranchById(id);
  }

  @Get('get/all')
  getAllBranches() {
    console.log('here');
    return this.branchService.getAllBranches();
  }
}
