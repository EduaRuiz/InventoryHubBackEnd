import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  // IsNumberString,
  IsNumber,
  IsUUID,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';
import { INewProductDomainCommand } from '@domain-commands';
import { ProductCategoryEnum } from '@enums';

export class NewProductCommand implements INewProductDomainCommand {
  @IsString({ message: 'El nombre debe ser un string' })
  @IsDefined({ message: 'El nombre es requerido' })
  @IsNotEmpty({ message: 'El nombre no puede ser vacío' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre debe tener menos de 100 caracteres' })
  name: string;

  @IsString({ message: 'La descripción debe ser un string' })
  @IsDefined({ message: 'La descripción es requerida' })
  @IsNotEmpty({ message: 'La descripción no puede ser vacía' })
  @MinLength(3, { message: 'La descripción debe tener al menos 3 caracteres' })
  @MaxLength(255, {
    message: 'La descripción debe tener menos de 255 caracteres',
  })
  description: string;

  @IsDefined({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  // @IsNumberString()
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  price: number;

  @IsString({ message: 'La categoría debe ser un string' })
  @IsDefined({ message: 'La categoría es requerida' })
  @IsNotEmpty({ message: 'La categoría no puede ser vacía' })
  @IsIn([...Object.values(ProductCategoryEnum)], {
    message: `La categoría no es válida, las categorías válidas son: ${Object.values(
      ProductCategoryEnum,
    )}`,
  })
  category: string;

  @IsString({ message: 'El id de la sucursal debe ser un string' })
  @IsDefined({ message: 'El id de la sucursal es requerido' })
  @IsNotEmpty({ message: 'El id de la sucursal no puede ser vacío' })
  @IsUUID(4, { message: 'El id de la sucursal debe ser un UUID' })
  branchId: string;
}
