import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { IAddProductDomainDto } from 'src/domain';

export class AddProductDto implements IAddProductDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
