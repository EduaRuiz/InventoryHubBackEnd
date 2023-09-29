import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation } from '@validations';

export class ProductQuantityValueObject extends ValueObjectBase<number> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'ProductQuantity',
        message: 'La cantidad no puede ser vacía',
      } as IErrorValueObject);
    } else {
      this.validateLength();
      this.validateInteger();
    }
  }

  private validateLength(): void {
    if (this.value && this.value < 0) {
      this.setError({
        field: 'ProductQuantity',
        message: 'La cantidad de producto no puede ser negativa',
      } as IErrorValueObject);
    }
  }

  private validateInteger(): void {
    if (this.value && !Number.isInteger(this.value)) {
      this.setError({
        field: 'ProductQuantity',
        message: 'La cantidad de producto debe ser un entero',
      } as IErrorValueObject);
    }
  }
}
