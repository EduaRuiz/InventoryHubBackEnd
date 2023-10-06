import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsInEnumValidation } from '@validations';
import { ProductCategoryEnum } from '@enums';

export class ProductCategoryValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'ProductCategory',
        message: 'La categoría no puede ser vacía',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !IsInEnumValidation(this.value, ProductCategoryEnum)) {
      this.setError({
        field: 'ProductCategory',
        message: `La categoría debe estar dentro de las siguientes: ${Object.values(
          ProductCategoryEnum,
        )}`,
      } as IErrorValueObject);
    }
  }
}
