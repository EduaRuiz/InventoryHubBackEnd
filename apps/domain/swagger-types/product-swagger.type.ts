import { ApiProperty } from '@nestjs/swagger';

export class ProductSwaggerType {
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  branchId: string;
}
