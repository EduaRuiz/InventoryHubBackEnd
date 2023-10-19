import { Body, Controller, Post } from '@nestjs/common';
import { BranchDomainModel } from '@domain-models';
import { BranchRegisterUseCase } from '@use-cases-command/branch';
import { Observable } from 'rxjs';
import { NewBranchCommand } from '../utils/commands';
import { UserRoleEnum } from '@enums';
import { Auth } from '../utils/decorators/auth.decorator';
import {
  BranchSwaggerType,
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
} from '@domain/swagger-types';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Command branch api')
@ApiBearerAuth('JWT')
@Controller('api/v1/branch')
export class BranchController {
  constructor(private readonly branchRegisterUseCase: BranchRegisterUseCase) {}

  @ApiOperation({
    summary: 'Register branch',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: BranchSwaggerType,
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
  @Auth(UserRoleEnum.SUPER_ADMIN)
  @Post('register')
  registerBranch(
    @Body() branch: NewBranchCommand,
  ): Observable<BranchDomainModel> {
    return this.branchRegisterUseCase.execute(branch);
  }
}
