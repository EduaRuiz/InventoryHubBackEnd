import { Body, Controller, Post } from '@nestjs/common';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from '@use-cases-command/user';
import { Observable } from 'rxjs';
import { NewUserCommand } from '../utils/commands';
import { Auth } from '../utils/decorators/auth.decorator';
import { UserRoleEnum } from '@enums';
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

@ApiTags('Command user api')
@ApiBearerAuth('JWT')
@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userRegisterUseCase: UserRegisterUseCase) {}

  @ApiOperation({
    summary: 'Register user',
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
  @Post('register')
  registerUser(@Body() user: NewUserCommand): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }

  @ApiOperation({
    summary: 'Seed user',
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
  @Post('seed')
  seedUser(): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(new NewUserCommand());
  }
}
