import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmailStructureValidation, IsEmptyValidation } from '@validations';

export class UserEmailValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserEmail',
        message: 'El "UserEmail" no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !IsEmailStructureValidation(this.value)) {
      this.setError({
        field: 'UserEmail',
        message: 'No es un correo electrónico válido',
      } as IErrorValueObject);
    }
  }
}
