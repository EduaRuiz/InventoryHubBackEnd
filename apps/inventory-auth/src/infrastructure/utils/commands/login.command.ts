import { IsString, IsDefined, IsNotEmpty, Matches } from 'class-validator';
import { ILoginDomainCommand } from '@domain-commands';
import { EMAIL_REGEX } from '@domain/common/regex';

export class LoginCommand implements ILoginDomainCommand {
  @IsString({ message: 'El correo debe ser un string' })
  @IsDefined({ message: 'El correo es requerido' })
  @IsNotEmpty({ message: 'El correo no puede ser vacío' })
  @Matches(EMAIL_REGEX, { message: 'El correo no es válido' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un string' })
  @IsDefined({ message: 'La contraseña es requerida' })
  @IsNotEmpty({ message: 'La contraseña no puede ser vacía' })
  password: string;
}
