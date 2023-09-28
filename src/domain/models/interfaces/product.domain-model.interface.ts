import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductDescriptionValueObject,
  ProductPriceValueObject,
  ProductQuantityValueObject,
  ProductCategoryValueObject,
  ProductBranchIdValueObject,
} from '@value-objects/product';

export interface IProductDomainModel {
  id?: string | ProductIdValueObject;
  name: string | ProductNameValueObject;
  description: string | ProductDescriptionValueObject;
  price: number | ProductPriceValueObject;
  quantity: number | ProductQuantityValueObject;
  category: string | ProductCategoryValueObject;
  branchId: string | ProductBranchIdValueObject;
}
