import { ApiProperty } from '@nestjs/swagger';
import { ProductSwaggerType } from './product-swagger.type';
import { UserSwaggerType } from './user-swagger.type';
import { SaleSwaggerType } from './sale-swagger.type';

export class BranchSwaggerType {
  @ApiProperty()
  name: string;
  @ApiProperty()
  location: string;
  @ApiProperty()
  products: ProductSwaggerType[];
  @ApiProperty()
  users: UserSwaggerType[];
  @ApiProperty()
  sales: SaleSwaggerType[];
}
