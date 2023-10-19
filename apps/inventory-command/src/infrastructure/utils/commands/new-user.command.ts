import { EMAIL_REGEX, PASSWORD_REGEX } from '@domain/common/regex';
import {
  IsDefined,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  ValidateNested,
} from 'class-validator';
import { INewUserDomainCommand } from '@domain-commands';
import { UserRoleEnum } from '@enums';
import { FullNameCommand } from './full-name.command';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NewUserCommand implements INewUserDomainCommand {
  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
  })
  @IsString({ message: 'El correo debe ser un string' })
  @IsDefined({ message: 'El correo es requerido' })
  @IsNotEmpty({ message: 'El correo no puede ser vacío' })
  @Matches(EMAIL_REGEX, { message: 'El correo no es válido' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Password123',
  })
  @IsString({ message: 'La contraseña debe ser un string' })
  @IsDefined({ message: 'La contraseña es requerida' })
  @IsNotEmpty({ message: 'La contraseña no puede ser vacía' })
  @Matches(PASSWORD_REGEX, {
    message:
      'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una minúscula y un número y máximo 16 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: UserRoleEnum.ADMIN,
  })
  @IsString({ message: 'El rol debe ser un string' })
  @IsDefined({ message: 'El rol es requerido' })
  @IsNotEmpty({ message: 'El rol no puede ser vacío' })
  @IsIn(Object.values(UserRoleEnum), {
    message: `El rol no es válido, los roles válidos son: ${Object.values(
      UserRoleEnum,
    )}`,
  })
  role: string;

  @ApiProperty({
    description: 'Branch id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsString({ message: 'El id de la sucursal debe ser un string' })
  @IsDefined({ message: 'El id de la sucursal es requerido' })
  @IsNotEmpty({ message: 'El id de la sucursal no puede ser vacío' })
  @IsUUID(4, { message: 'El id de la sucursal debe ser un UUID' })
  branchId: string;

  @ApiProperty({
    description: 'User full name',
    type: FullNameCommand,
    example: {
      firstName: 'First name',
      lastName: 'Last name',
    },
  })
  @IsDefined({ message: 'El nombre es requerido' })
  @ValidateNested()
  @Type(() => FullNameCommand)
  fullName: FullNameCommand;
}
