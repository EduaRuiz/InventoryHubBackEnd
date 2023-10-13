import { Body, Controller, Post } from '@nestjs/common';
import { BranchDomainModel } from '@domain-models';
import { BranchRegisterUseCase } from '@use-cases-inv/branch';
import { Observable } from 'rxjs';
import { NewBranchCommand } from '../utils/commands';
import { UserRoleEnum } from '@enums';
import { Auth } from '../utils/decorators/auth.decorator';

@Controller('api/v1/branch')
export class BranchController {
  constructor(private readonly branchRegisterUseCase: BranchRegisterUseCase) {}

  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Post('register')
  registerBranch(
    @Body() branch: NewBranchCommand,
  ): Observable<BranchDomainModel> {
    return this.branchRegisterUseCase.execute(branch);
  }
}
