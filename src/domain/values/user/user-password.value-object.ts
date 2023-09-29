import { PASSWORD_REGEX } from '@domain-common/regex';
import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation } from '@validations';

export class UserPasswordValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserPassword',
        message: 'La contraseña no puede ser vacía',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !PASSWORD_REGEX.test(this.value)) {
      this.setError({
        field: 'UserPassword',
        message:
          'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una minúscula y un número y máximo 16 caracteres',
      } as IErrorValueObject);
    }
  }
}
