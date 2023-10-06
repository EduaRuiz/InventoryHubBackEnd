import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';
import { SaleProductType } from '@types';

export class SaleProductValueObject extends ValueObjectBase<SaleProductType> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'SaleProduct',
        message: 'El producto no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (
      this.value &&
      this.value.name &&
      !StringRangeLength(this.value.name, 3, 100)
    ) {
      this.setError({
        field: 'SaleProduct.name',
        message:
          'La longitud del nombre del producto no se encuentra dentro del rango min: 3 y max: 100',
      } as IErrorValueObject);
    }
    if (this.value && this.value.price && this.value.price <= 0) {
      this.setError({
        field: 'SaleProduct.price',
        message: 'El precio no puede ser igual o menor a 0',
      } as IErrorValueObject);
    }
    if (this.value && this.value.quantity && this.value.quantity <= 0) {
      this.setError({
        field: 'SaleProduct.quantity',
        message: 'La cantidad no puede ser igual o menor a 0',
      } as IErrorValueObject);
    }
  }
}
