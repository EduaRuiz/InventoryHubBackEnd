import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation } from '@validations';

export class SaleNumberValueObject extends ValueObjectBase<number> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'SaleNumber',
        message: 'El numero no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
      this.validateInteger();
    }
  }

  private validateLength(): void {
    if (this.value && this.value < 0) {
      this.setError({
        field: 'SaleNumber',
        message: 'El numero de la venta no puede ser negativo',
      } as IErrorValueObject);
    }
  }

  private validateInteger(): void {
    if (this.value && !Number.isInteger(this.value)) {
      this.setError({
        field: 'SaleNumber',
        message: 'El numero de la venta debe ser un entero',
      } as IErrorValueObject);
    }
  }
}
