import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from '../persistence/services';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from '@use-cases/user';
import { Observable } from 'rxjs';
import { NewUserCommand } from '../utils/commands';

@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRegisterUseCase: UserRegisterUseCase,
  ) {}

  @Post('register')
  registerUser(@Body() user: NewUserCommand): Observable<UserDomainModel> {
    return this.userRegisterUseCase.execute(user);
  }

  @Get(':id')
  getUserInfo(userId: string): Observable<UserDomainModel> {
    return this.userService.getUserById(userId);
  }

  @Get('all/all')
  getAllUsers(): Observable<UserDomainModel[]> {
    return this.userService.getAllUsers();
  }
}
