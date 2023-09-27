import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
} from 'class-validator';
import { ICustomerSaleDomainDto } from 'src/domain';

export class CustomerSaleDto implements ICustomerSaleDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  productId: string;

  // @IsString()
  // @IsDefined()
  // @IsNotEmpty()
  // branchId: string;

  @IsDefined()
  // @IsNumberString()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
