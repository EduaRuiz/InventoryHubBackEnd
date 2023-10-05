import { Body, Controller, Post } from '@nestjs/common';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from '@use-cases-inv/user';
import { Observable } from 'rxjs';
import { NewUserCommand } from '../utils/commands';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userRegisterUseCase: UserRegisterUseCase) {}

  @Post('register')
  registerUser(@Body() user: NewUserCommand): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }
}
