import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ISellerSaleDomainCommand } from '@domain-commands';
import { ProductSaleDto } from './product-sale.dto';
import { Type } from 'class-transformer';

export class SellerSaleCommand implements ISellerSaleDomainCommand {
  @IsString({ message: 'El id del usuario debe ser un string' })
  @IsDefined({ message: 'El id del usuario es requerido' })
  @IsNotEmpty({ message: 'El id del usuario no puede ser vacío' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID' })
  userId: string;

  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  branchId: string;

  @IsDefined()
  @IsNumber()
  @Min(0.000001, { message: 'El descuento no puede ser menor o igual al 0%.' })
  @Max(0.999999, {
    message: 'El descuento no puede ser igual o mayor al 100%.',
  })
  discount: number;

  @ValidateNested()
  @Type(() => ProductSaleDto)
  products: ProductSaleDto[];
}
