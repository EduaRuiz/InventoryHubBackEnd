﻿import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class FullNameCommand {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsDefined({ message: 'El nombre es requerido' })
  @IsNotEmpty({ message: 'El nombre no puede ser vacío' })
  firstName: string;

  @IsString({ message: 'El apellido debe ser un string' })
  @IsDefined({ message: 'El apellido es requerido' })
  @IsNotEmpty({ message: 'El apellido no puede ser vacío' })
  lastName: string;
}
