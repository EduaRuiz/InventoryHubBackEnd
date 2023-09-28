import {
  IsString,
  IsDefined,
  IsNotEmpty,
  // IsNumberString,
  IsPositive,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { ISellerSaleDomainCommand } from 'src/domain';

export class SellerSaleDto implements ISellerSaleDomainCommand {
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
  @IsNumber()
  // @IsNumberString()
  @IsPositive()
  quantity: number;

  @IsDefined()
  @IsNumber()
  // @IsNumberString()
  // @IsPositive()
  @Min(0.000001, { message: 'El descuento no puede ser menor o igual al 0%.' })
  @Max(0.999999, {
    message: 'El descuento no puede ser igual o mayor al 100%.',
  })
  discount: number;
}
