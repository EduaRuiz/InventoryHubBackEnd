import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../persistence/services';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from 'src/application/use-cases/user';
import { Observable } from 'rxjs';
import { NewUserDto } from '../utils/dtos';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRegisterUseCase: UserRegisterUseCase,
  ) {}

  @Post('register')
  registerUser(@Body() user: NewUserDto): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }
}
