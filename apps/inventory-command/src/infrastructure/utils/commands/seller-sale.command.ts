import {
  IsString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsUUID,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { ISellerSaleDomainCommand } from '@domain-commands';
import { ProductSaleDto } from './product-sale.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SellerSaleCommand implements ISellerSaleDomainCommand {
  @ApiProperty({
    description: 'User id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsOptional()
  @IsString({ message: 'El id del usuario debe ser un string' })
  @IsDefined({ message: 'El id del usuario es requerido' })
  @IsNotEmpty({ message: 'El id del usuario no puede ser vacío' })
  @IsUUID(4, { message: 'El id del usuario debe ser un UUID' })
  userId?: string;

  @ApiProperty({
    description: 'Branch id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  branchId: string;

  @ApiProperty({
    description: 'Discount',
    example: 0.5,
  })
  @IsOptional()
  @IsDefined()
  @IsNumber()
  @Min(0.000001, { message: 'El descuento no puede ser menor o igual al 0%.' })
  @Max(0.999999, {
    message: 'El descuento no puede ser igual o mayor al 100%.',
  })
  discount?: number;

  @ApiProperty({
    description: 'Products',
    type: ProductSaleDto,
    example: {
      productId: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
      quantity: 1,
    },
  })
  @ValidateNested()
  @Type(() => ProductSaleDto)
  products: ProductSaleDto[];
}
