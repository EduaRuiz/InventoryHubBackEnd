import { UserRoleEnum } from '@enums';
import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleProtected } from './role.decorator';
import { UserRolGuard } from '../guards';

export function Auth(...roles: UserRoleEnum[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRolGuard),
  );
}
