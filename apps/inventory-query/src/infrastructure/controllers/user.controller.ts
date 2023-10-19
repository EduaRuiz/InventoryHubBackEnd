import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../persistence';
import { UserRoleEnum } from '@enums';
import { Auth } from '../utils/decorators/auth.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
  UserSwaggerType,
} from '@domain/swagger-types';

@ApiTags('User query api')
@ApiBearerAuth('JWT')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserSwaggerType,
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
  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @ApiOperation({
    summary: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: [UserSwaggerType],
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
  @Get('users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
