import { UserRoleEnum } from '@enums';
import { SetMetadata } from '@nestjs/common';

export const RoleProtected = (...args: UserRoleEnum[]) => {
  return SetMetadata('roles', args);
};
