import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LocationCommand {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  city: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  country: string;
}
