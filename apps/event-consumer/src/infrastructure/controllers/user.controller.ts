import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../persistence';

@Controller('api/v1/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }
}
