import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';

export class BranchNameValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'BranchName',
        message: 'El nombre no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !StringRangeLength(this.value, 3, 100)) {
      this.setError({
        field: 'BranchName',
        message:
          'La longitud del nombre no se encuentra dentro del rango min: 3 y max: 100',
      } as IErrorValueObject);
    }
  }
}
