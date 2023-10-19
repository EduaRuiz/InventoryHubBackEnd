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
import { ApiProperty } from '@nestjs/swagger';

export class NewBranchCommand implements INewBranchDomainCommand {
  @ApiProperty({
    description: 'Branch name',
    minLength: 3,
    maxLength: 100,
    example: 'Branch name',
  })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Branch location',
    type: LocationCommand,
    example: {
      city: 'City',
      country: 'Country',
    },
  })
  @ValidateNested()
  @Type(() => LocationCommand)
  location: LocationCommand;
}
