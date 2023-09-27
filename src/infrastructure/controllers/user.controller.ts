import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../persistence/services';
import { UserDomainModel } from '@domain-models';
import { RegisterUserUseCase } from 'src/application/use-cases/user';
import { Observable } from 'rxjs';
import { NewUserDto } from '../utils/dtos';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  registerUser(@Body() user: NewUserDto): Observable<UserDomainModel> {
    const newUser = new RegisterUserUseCase(
      this.userService,
      // this.registeredNewUserPublisher,
    );
    return newUser.execute(user);
  }
}
