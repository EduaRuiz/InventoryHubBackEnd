import { INewBranchDomainDto } from 'src/domain';
import {
  IsDefined,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LocationDto } from './location.dto';

export class NewBranchDto implements INewBranchDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
