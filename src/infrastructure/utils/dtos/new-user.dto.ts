import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { INewUserDomainDto } from 'src/domain';

export class NewUserDto implements INewUserDomainDto {
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
