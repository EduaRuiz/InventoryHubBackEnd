import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { IAddProductDomainCommand } from '@domain-commands';
import { ApiProperty } from '@nestjs/swagger';

export class AddProductCommand implements IAddProductDomainCommand {
  @ApiProperty({
    description: 'Product id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsOptional()
  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  id?: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Product name',
  })
  @IsDefined({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  quantity: number;
}
