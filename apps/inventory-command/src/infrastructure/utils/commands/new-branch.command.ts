import { INewBranchDomainCommand } from '@domain-commands';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { LocationCommand } from './location.command';
import { Type } from 'class-transformer';

export class NewBranchCommand implements INewBranchDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
  name: string;

  @ValidateNested()
  @Type(() => LocationCommand)
  location: LocationCommand;
}
