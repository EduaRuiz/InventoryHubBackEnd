import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from '../persistence';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BranchSwaggerType,
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
} from '@domain/swagger-types';

@ApiTags('Branch query api')
@ApiBearerAuth('JWT')
@Controller('api/v1')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @ApiOperation({
    summary: 'Get branch by id',
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
  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('branch/:id')
  getBranch(@Param('id') id: string) {
    return this.branchService.getBranch(id);
  }

  @ApiOperation({
    summary: 'Get all branches',
  })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [BranchSwaggerType],
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
  @Get('branches')
  getAllBranches() {
    return this.branchService.getAllBranches();
  }
}
