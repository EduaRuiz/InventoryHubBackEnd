// location.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LocationDto {
  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
