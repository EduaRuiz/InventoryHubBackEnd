import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
} from 'class-validator';
import { IAddProductDomainDto } from 'src/domain';

export class AddProductDto implements IAddProductDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  id: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
