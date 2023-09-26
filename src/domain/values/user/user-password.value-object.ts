import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsPasswordValidation } from '@validations';

export class UserPasswordValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserPassword',
        message: 'El "UserPassword" no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !IsPasswordValidation(this.value)) {
      this.setError({
        field: 'UserPassword',
        message:
          'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una minúscula y un número',
      } as IErrorValueObject);
    }
  }
}
