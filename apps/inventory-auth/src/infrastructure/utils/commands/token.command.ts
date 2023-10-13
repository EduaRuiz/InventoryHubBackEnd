import { IsString, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { ITokenCommand } from '@domain-commands';

export class TokenCommand implements ITokenCommand {
  @IsString({ message: 'El id debe ser un string' })
  @IsDefined({ message: 'El id es requerido' })
  @IsNotEmpty({ message: 'El id no puede ser vacío' })
  @IsUUID(4, { message: 'El id debe ser un UUID' })
  id: string;

  @IsString({ message: 'El token debe ser un string' })
  @IsDefined({ message: 'El token es requerido' })
  @IsNotEmpty({ message: 'El token no puede ser vacío' })
  token: string;
}
