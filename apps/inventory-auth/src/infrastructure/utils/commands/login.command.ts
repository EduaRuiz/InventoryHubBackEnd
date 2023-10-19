import { IsString, IsDefined, IsNotEmpty, Matches } from 'class-validator';
import { ILoginDomainCommand } from '@domain-commands';
import { EMAIL_REGEX } from '@domain/common/regex';
import { ApiProperty } from '@nestjs/swagger';

export class LoginCommand implements ILoginDomainCommand {
  @ApiProperty({
    description: 'Email',
    example: 'example@example.com',
  })
  @IsString({ message: 'El correo debe ser un string' })
  @IsDefined({ message: 'El correo es requerido' })
  @IsNotEmpty({ message: 'El correo no puede ser vacío' })
  @Matches(EMAIL_REGEX, { message: 'El correo no es válido' })
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'Password123',
  })
  @IsString({ message: 'La contraseña debe ser un string' })
  @IsDefined({ message: 'La contraseña es requerida' })
  @IsNotEmpty({ message: 'La contraseña no puede ser vacía' })
  password: string;
}
