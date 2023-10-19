import { Body, Controller, Post } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LoginUseCase } from '../../application';
import { LoginCommand } from '../utils/commands';
import { RefreshTokenUseCase } from '@use-cases-auth';
import { TokenCommand } from '../utils/commands';
import { ILoginResponse } from '@domain/interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ConflictSwagger,
  NotFoundSwagger,
  UnauthorizedSwagger,
} from '@domain/swagger-types';

@ApiTags('Auth api')
@Controller('api/v1')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @ApiOperation({
    summary: 'Login user',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
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
  @Post('login')
  loginUser(@Body() loginCommand: LoginCommand): Observable<ILoginResponse> {
    return this.loginUseCase.execute(loginCommand);
  }

  @ApiOperation({
    summary: 'Refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'The found record',
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
  @Post('refresh-token')
  refreshToken(
    @Body() refreshToken: TokenCommand,
  ): Observable<{ token: string }> {
    return this.refreshTokenUseCase.execute(refreshToken).pipe(
      map((token) => {
        return { token };
      }),
    );
  }
}
