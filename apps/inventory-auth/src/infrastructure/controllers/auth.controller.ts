import { Body, Controller, Post } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { LoginUseCase } from '../../application';
import { LoginCommand } from '../utils/commands';
import { ILoginResponse } from 'apps/domain/interfaces';
import { RefreshTokenUseCase } from '../../application/refresh-token.use-case';
import { TokenCommand } from '../utils/commands/token.command';

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
    console.log(refreshToken);
    return this.refreshTokenUseCase.execute(refreshToken).pipe(
      map((token) => {
        return { token };
      }),
    );
  }
}
