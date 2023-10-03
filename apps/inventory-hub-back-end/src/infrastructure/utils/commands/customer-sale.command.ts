import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ICustomerSaleDomainCommand } from '@domain-commands';

export class CustomerSaleCommand implements ICustomerSaleDomainCommand {
  @IsString({ message: 'El id del cliente debe ser un string' })
  @IsDefined({ message: 'El id del cliente es requerido' })
  @IsNotEmpty({ message: 'El id del cliente no puede ser vacío' })
  @IsUUID(4, { message: 'El id del cliente debe ser un UUID' })
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
}
