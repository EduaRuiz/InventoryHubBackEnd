import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductDescriptionValueObject,
  ProductPriceValueObject,
  ProductQuantityValueObject,
  ProductCategoryValueObject,
} from '../values/product';
import { IProductDomainModel } from './interfaces';

export class ProductDomainModel implements IProductDomainModel {
  id?: string | ProductIdValueObject;
  name: string | ProductNameValueObject;
  description: string | ProductDescriptionValueObject;
  price: number | ProductPriceValueObject;
  quantity: number | ProductQuantityValueObject;
  category: string | ProductCategoryValueObject;
  branchId?: string;
}
