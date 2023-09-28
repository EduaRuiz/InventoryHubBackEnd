import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ICustomerSaleDomainCommand } from 'src/domain';

export class CustomerSaleDto implements ICustomerSaleDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
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
