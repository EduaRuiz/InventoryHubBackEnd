import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';
import { FullName } from '@types';

export class UserNameValueObject extends ValueObjectBase<FullName> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserName',
        message: 'El nombre no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !StringRangeLength(this.value.firstName, 3, 100)) {
      this.setError({
        field: 'UserName',
        message:
          'La longitud del nombre no se encuentra dentro del rango min: 3 y max: 100',
      } as IErrorValueObject);
    }
    if (this.value && !StringRangeLength(this.value.lastName, 3, 100)) {
      this.setError({
        field: 'UserName',
        message:
          'La longitud del apellido no se encuentra dentro del rango min: 3 y max: 100',
      } as IErrorValueObject);
    }
  }
}
