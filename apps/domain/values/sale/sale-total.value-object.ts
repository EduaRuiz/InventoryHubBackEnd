import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation } from '@validations';

export class SaleTotalValueObject extends ValueObjectBase<number> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'SaleTotal',
        message: 'El total no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && this.value <= 0) {
      this.setError({
        field: 'SaleTotal',
        message: 'El total no puede ser igual o menor a 0',
      } as IErrorValueObject);
    }
  }
}
