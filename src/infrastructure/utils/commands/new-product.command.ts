import {
  IsDefined,
  IsNotEmpty,
  IsPositive,
  IsString,
  // IsNumberString,
  IsNumber,
  IsUUID,
  IsIn,
} from 'class-validator';
import { INewProductDomainCommand } from '../../../domain/commands';

export class NewProductCommand implements INewProductDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  description: string;

  @IsDefined()
  @IsNumber()
  // @IsNumberString()
  @IsPositive()
  price: number;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsIn([
    'Herramientas Manuales',
    'Herramientas Eléctricas',
    'Cerrajería',
    'Ferretería para la Construcción',
    'Pintura y Accesorios',
    'Jardinería y Exteriores',
    'Equipamiento de Seguridad y Protección',
    'Materiales para Fontanería',
    'Electricidad',
    'Artículos para el Hogar',
  ])
  category: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  branchId: string;
}
