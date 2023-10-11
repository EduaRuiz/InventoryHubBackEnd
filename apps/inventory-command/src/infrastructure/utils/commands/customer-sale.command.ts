import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ICustomerSaleDomainCommand } from '@domain-commands';
import { ProductSaleDto } from './product-sale.dto';
import { Type } from 'class-transformer';

export class CustomerSaleCommand implements ICustomerSaleDomainCommand {
  @IsOptional()
  @IsString({ message: 'El id del usuario debe ser un string' })
  @IsDefined({ message: 'El id del usuario es requerido' })
  @IsNotEmpty({ message: 'El id del usuario no puede ser vacío' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID' })
  userId?: string;

  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  branchId: string;

  @ValidateNested()
  @Type(() => ProductSaleDto)
  products: ProductSaleDto[];
}
