import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDefined,
} from 'class-validator';

export class LocationCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'La ciudad debe tener menos de 100 caracteres' })
  city: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, {
    message: 'El país debe tener al menos 3 caracteres',
  })
  @MaxLength(50, {
    message: 'El país debe tener menos de 50 caracteres',
  })
  country: string;
}
