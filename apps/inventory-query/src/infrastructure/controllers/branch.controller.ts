import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from '../persistence';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';

@Controller('api/v1')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('branch/:id')
  getBranch(@Param('id') id: string) {
    return this.branchService.getBranch(id);
  }

  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Get('branches')
  getAllBranches() {
    return this.branchService.getAllBranches();
  }
}
