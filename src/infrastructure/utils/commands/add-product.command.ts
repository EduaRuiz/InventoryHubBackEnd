import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  // IsNumberString,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { IAddProductDomainCommand } from 'src/domain';

export class AddProductCommand implements IAddProductDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsDefined()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
