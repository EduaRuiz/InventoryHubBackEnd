import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../persistence';
import { UserRoleEnum } from '@enums';
import { Auth } from '../utils/decorators/auth.decorator';

@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('user/:id')
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Auth(UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN)
  @Get('users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
