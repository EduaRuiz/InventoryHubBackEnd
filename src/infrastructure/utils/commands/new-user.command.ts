import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { INewUserDomainCommand } from 'src/domain';

export class NewUserCommand implements INewUserDomainCommand {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsIn(['super administrador', 'administrador', 'empleado'])
  role: string;

  @IsOptional()
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @IsUUID()
  branchId?: string;
}
