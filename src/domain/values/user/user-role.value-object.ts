import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsInEnumValidation } from '@validations';
import { UserRoleEnum } from '../../enums';

export class UserRoleValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'UserRole',
        message: 'El "UserRole" no puede ser vacío',
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
          'El "UserRole" debe ser uno de los siguientes valores: "Herramientas Manuales", "Herramientas Eléctricas", "Cerrajería", "Ferretería para la Construcción", "Pintura y Accesorios", "Jardinería y Exteriores", "Equipamiento de Seguridad y Protección", "Materiales para Fontanería", "Electricidad", "Artículos para el Hogar"',
      } as IErrorValueObject);
    }
  }
}
