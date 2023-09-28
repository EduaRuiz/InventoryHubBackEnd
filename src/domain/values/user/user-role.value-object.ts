import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsInEnumValidation } from '@validations';
import { UserRoleEnum } from '../../enums';

export class UserRoleValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserRole',
        message: 'El rol no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !IsInEnumValidation(this.value, UserRoleEnum)) {
      this.setError({
        field: 'UserRole',
        message:
          'El rol no está dentro de los siguientes valores: administrador, super administrador, empleado',
      } as IErrorValueObject);
    }
  }
}
