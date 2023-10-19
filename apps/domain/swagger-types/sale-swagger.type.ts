import { ApiProperty } from '@nestjs/swagger';
import { ProductSwaggerType } from './product-swagger.type';

export class SaleSwaggerType {
  @ApiProperty()
  number: number;
  @ApiProperty()
  products: ProductSwaggerType[];
  @ApiProperty()
  date: Date;
  @ApiProperty()
  type: string;
  @ApiProperty()
  total: number;
  @ApiProperty()
  branchId: string;
  @ApiProperty()
  userId: string;
}
