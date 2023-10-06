import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class ProductSaleDto {
  @IsString({ message: 'El id del producto debe ser un string' })
  @IsDefined({ message: 'El id del producto es requerido' })
  @IsNotEmpty({ message: 'El id del producto no puede ser vacío' })
  @IsUUID(4, { message: 'El id del producto debe ser un UUID' })
  productId: string;

  @IsDefined({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @IsPositive({ message: 'La cantidad debe ser un número positivo' })
  quantity: number;
}
