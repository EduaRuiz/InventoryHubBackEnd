import {
  IsString,
  IsDefined,
  IsNotEmpty,
  // IsNumberString,
  IsPositive,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ISellerSaleDomainDto } from 'src/domain';

export class SellerSaleDto implements ISellerSaleDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  productId: string;

  // @IsString()
  // @IsDefined()
  // @IsNotEmpty()
  // branchId: string;

  @IsDefined()
  @IsNumber()
  // @IsNumberString()
  @IsPositive()
  quantity: number;

  @IsDefined()
  @IsNumber()
  // @IsNumberString()
  // @IsPositive()
  @Min(0.000001, { message: 'Discount must be at least 0%.' })
  @Max(0.999999, { message: 'Discount cannot be equal or greater than 100%.' })
  discount: number;
}
