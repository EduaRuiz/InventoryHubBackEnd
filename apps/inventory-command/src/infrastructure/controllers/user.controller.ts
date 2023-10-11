import { Body, Controller, Post } from '@nestjs/common';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from '@use-cases-inv/user';
import { Observable } from 'rxjs';
import { NewUserCommand } from '../utils/commands';
import { AuthService } from '../utils/services/auth.service';

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly userRegisterUseCase: UserRegisterUseCase,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  registerUser(@Body() user: NewUserCommand): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }

  @Post('login')
  loginUser(
    @Body() user: { email: string; password: string },
  ): Observable<{ token: string }> {
    const { email, password } = user;
    return this.authService.validateUser(email, password);
  }
}
