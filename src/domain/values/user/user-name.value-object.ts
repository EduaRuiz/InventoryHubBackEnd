import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';
import { FullName } from '@types';

export class UserNameValueObject extends ValueObjectBase<FullName> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserName',
        message: 'El "UserName" no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (
      this.value &&
      !StringRangeLength(this.value.firstName, 5, 255) &&
      !StringRangeLength(this.value.lastName, 5, 255)
    ) {
      this.setError({
        field: 'UserName',
        message:
          'La longitud de "UserName" no se encuentra dentro del rango min: 5 y max: 255',
      } as IErrorValueObject);
    }
  }
}
