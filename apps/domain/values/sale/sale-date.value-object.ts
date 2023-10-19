import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { CurrentDateTimeValidation, IsEmptyValidation } from '@validations';

export class SaleDateValueObject extends ValueObjectBase<Date> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'Date',
        message: 'La fecha no puede ser vacía',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && CurrentDateTimeValidation(this.value, new Date())) {
      this.setError({
        field: 'Date',
        message: 'La fecha de la venta no puede ser mayor a la fecha actual',
      } as IErrorValueObject);
    }
  }
}
