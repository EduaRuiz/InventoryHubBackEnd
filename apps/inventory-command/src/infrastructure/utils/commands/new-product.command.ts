import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsNumber,
  IsUUID,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';
import { INewProductDomainCommand } from '@domain-commands';
import { ProductCategoryEnum } from '@enums';
import { ApiProperty } from '@nestjs/swagger';

export class NewProductCommand implements INewProductDomainCommand {
  @ApiProperty({
    description: 'Product name',
    minLength: 3,
    maxLength: 100,
    example: 'Product name',
  })
  @IsString({ message: 'El nombre debe ser un string' })
  @IsDefined({ message: 'El nombre es requerido' })
  @IsNotEmpty({ message: 'El nombre no puede ser vacío' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
  readonly name: string;

  @ApiProperty({
    description: 'Product description',
    minLength: 3,
    maxLength: 255,
    example: 'Product description',
  })
  @IsString({ message: 'La descripción debe ser un string' })
  @IsDefined({ message: 'La descripción es requerida' })
  @IsNotEmpty({ message: 'La descripción no puede ser vacía' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  @MaxLength(255, {
    message: 'La descripción debe tener menos de 255 caracteres',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Product price',
    example: 10,
  })
  @IsDefined({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  readonly price: number;

  @ApiProperty({
    description: 'Product category',
    example: ProductCategoryEnum.ConstructionHardware,
  })
  @IsString({ message: 'La categoría debe ser un string' })
  @IsDefined({ message: 'La categoría es requerida' })
  @IsNotEmpty({ message: 'La categoría no puede ser vacía' })
  @IsIn([...Object.values(ProductCategoryEnum)], {
    message: `La categoría no es válida, las categorías válidas son: ${Object.values(
      ProductCategoryEnum,
    )}`,
  })
  readonly category: ProductCategoryEnum;

  @ApiProperty({
    description: 'Branch id',
    example: '1e7d6c5e-2f8c-4f8d-8a6a-8c7a4f3b6c0b',
  })
  @IsString({ message: 'El id de la sucursal debe ser un string' })
  @IsDefined({ message: 'El id de la sucursal es requerido' })
  @IsNotEmpty({ message: 'El id de la sucursal no puede ser vacío' })
  @IsUUID(4, { message: 'El id de la sucursal debe ser un UUID' })
  readonly branchId: string;
}
