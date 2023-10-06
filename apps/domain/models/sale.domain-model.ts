import { ValueObjectBase } from '@sofka/bases';
import {
  SaleBranchIdValueObject,
  SaleIdValueObject,
  SaleNumberValueObject,
  SaleTotalValueObject,
  SaleTypeEnum,
  SaleTypeValueObject,
  SaleUserIdValueObject,
} from '..';
import { IErrorValueObject } from '@sofka/interfaces';
import { EntityBase } from '@sofka/bases/entity.base';
import { SaleProductType } from '../types/sale-product.type';

export class SaleDomainModel extends EntityBase {
  numberId: number;
  products: SaleProductType[];
  date: Date;
  type: SaleTypeEnum;
  total: number;
  branchId: string;
  userId: string;

  constructor(
    numberId: number,
    products: SaleProductType[],
    date: Date,
    type: SaleTypeEnum,
    total: number,
    branchId: string,
    userId: string,
    id?: string,
  ) {
    super(id);
    this.numberId = numberId;
    this.products = products;
    this.date = date;
    this.type = type;
    this.total = total;
    this.branchId = branchId;
    this.userId = userId;
  }

  private createValueObjects(): ValueObjectBase<any>[] {
    const numberId = new SaleNumberValueObject(this.numberId);
    const type = new SaleTypeValueObject(this.type);
    const total = new SaleTotalValueObject(this.total);
    const branchId = new SaleBranchIdValueObject(this.branchId);
    const userId = new SaleUserIdValueObject(this.branchId);
    const response: ValueObjectBase<any>[] = [
      numberId,
      type,
      total,
      branchId,
      userId,
    ];
    if (this.id) response.push(new SaleIdValueObject(this.id));
    return response;
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    let errors = new Array<IErrorValueObject>();
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        errors = [...errors, ...valueObject.getErrors()];
      }
    }
    return errors;
  }

  hasErrors(): boolean {
    return !!this.getErrors().length;
  }

  getErrors(): IErrorValueObject[] {
    const valueObjects = this.createValueObjects();
    return this.validateValueObjects(valueObjects);
  }
}
