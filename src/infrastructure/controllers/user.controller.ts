import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../persistence/services';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from 'src/application/use-cases/user';
import { Observable } from 'rxjs';
import { NewUserCommand } from '../utils/commands';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRegisterUseCase: UserRegisterUseCase,
  ) {}

  @Post('register')
  registerUser(@Body() user: NewUserCommand): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }

  @Get('info/:id')
  getUserInfo(userId: string): Observable<UserDomainModel> {
    return this.userService.getUserById(userId);
  }

  @Get('all')
  getAllUsers(): Observable<UserDomainModel[]> {
    return this.userService.getAllUsers();
  }
}
