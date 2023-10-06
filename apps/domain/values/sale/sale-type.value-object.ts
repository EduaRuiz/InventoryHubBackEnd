import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsInEnumValidation } from '@validations';
import { SaleTypeEnum } from '@enums';

export class SaleTypeValueObject extends ValueObjectBase<SaleTypeEnum> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'SaleType',
        message: 'El tipo no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !IsInEnumValidation(this.value, SaleTypeEnum)) {
      this.setError({
        field: 'SaleType',
        message: `El tipo debe estar dentro de los siguientes: ${Object.values(
          SaleTypeEnum,
        )}`,
      } as IErrorValueObject);
    }
  }
}
