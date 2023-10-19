import { ApiProperty } from '@nestjs/swagger';

export class UserSwaggerType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  branchId: string;
}
