import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsDefined,
} from 'class-validator';

export class LocationCommand {
  @ApiProperty({
    description: 'City',
    minLength: 3,
    maxLength: 100,
    example: 'City',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, { message: 'La ciudad debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'La ciudad debe tener menos de 100 caracteres' })
  city: string;

  @ApiProperty({
    description: 'Country',
    minLength: 3,
    maxLength: 50,
    example: 'Country',
  })
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
