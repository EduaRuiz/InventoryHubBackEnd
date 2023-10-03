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
  IsInt,
} from 'class-validator';
import { ISellerSaleDomainCommand } from '@domain-commands';

export class SellerSaleCommand implements ISellerSaleDomainCommand {
  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  productId: string;

  // @IsString()
  // @IsDefined()
  // @IsNotEmpty()
  // branchId: string;

  @IsDefined({ message: 'La cantidad es requerida' })
  // @IsNumberString()
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
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
