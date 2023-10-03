import { INewBranchDomainCommand } from '@domain-commands';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer';
// import { LocationCommand } from './location.command';

export class NewBranchCommand implements INewBranchDomainCommand {
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

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
  name: string;

  // @ValidateNested()
  // @Type(() => LocationCommand)
  // location: LocationCommand;
}
