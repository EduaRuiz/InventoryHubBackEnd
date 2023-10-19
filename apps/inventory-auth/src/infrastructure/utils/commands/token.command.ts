import { IsString, IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { ITokenCommand } from '@domain-commands';
import { ApiProperty } from '@nestjs/swagger';

export class TokenCommand implements ITokenCommand {
  @ApiProperty({
    description: 'Id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsString({ message: 'El id debe ser un string' })
  @IsDefined({ message: 'El id es requerido' })
  @IsNotEmpty({ message: 'El id no puede ser vacío' })
  @IsUUID(4, { message: 'El id debe ser un UUID' })
  id: string;

  @ApiProperty({
    description: 'TokenJWT',
    example: 'Token',
  })
  @IsString({ message: 'El token debe ser un string' })
  @IsDefined({ message: 'El token es requerido' })
  @IsNotEmpty({ message: 'El token no puede ser vacío' })
  token: string;
}
