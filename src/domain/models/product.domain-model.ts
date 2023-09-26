import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductDescriptionValueObject,
  ProductPriceValueObject,
  ProductQuantityValueObject,
  ProductCategoryValueObject,
} from '../values/product';

export class ProductDomainModel {
  id: string | ProductIdValueObject;
  name: string | ProductNameValueObject;
  description: string | ProductDescriptionValueObject;
  price: number | ProductPriceValueObject;
  quantity: number | ProductQuantityValueObject;
  category: string | ProductCategoryValueObject;
}
