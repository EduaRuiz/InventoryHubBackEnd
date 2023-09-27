import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  // IsNumberString,
  IsNumber,
} from 'class-validator';
import { INewProductDomainDto } from '../../../domain/dtos';

export class NewProductDto implements INewProductDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsDefined()
  @IsNumber()
  // @IsNumberString()
  @IsPositive()
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  branchId: string;
}
