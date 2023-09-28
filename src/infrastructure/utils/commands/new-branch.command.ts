import { INewBranchDomainCommand } from 'src/domain';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.command';

export class NewBranchCommand implements INewBranchDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
