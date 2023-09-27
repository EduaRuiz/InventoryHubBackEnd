import {
  IsDefined,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { INewUserDomainDto } from 'src/domain';

export class NewUserDto implements INewUserDomainDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  name: string;

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
  branchId?: string;
}
