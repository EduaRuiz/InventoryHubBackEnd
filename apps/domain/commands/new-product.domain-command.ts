import { ProductCategoryEnum } from '@enums';

export interface INewProductDomainCommand {
  name: string;
  description: string;
  price: number;
  category: ProductCategoryEnum;
  branchId: string;
}
