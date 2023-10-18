import { Body, Controller, Post } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LoginUseCase } from '../../application';
import { LoginCommand } from '../utils/commands';
import { RefreshTokenUseCase } from '@use-cases-auth';
import { TokenCommand } from '../utils/commands';
import { ILoginResponse } from '@domain/interfaces';

@Controller('api/v1')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('login')
  loginUser(@Body() loginCommand: LoginCommand): Observable<ILoginResponse> {
    return this.loginUseCase.execute(loginCommand);
  }

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
