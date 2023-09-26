import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation } from '@validations';

export class ProductPriceValueObject extends ValueObjectBase<number> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'ProductPrice',
        message: 'El "ProductPrice" no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && this.value <= 0) {
      this.setError({
        field: 'ProductPrice',
        message: 'El precio no puede ser igual o menor a 0',
      } as IErrorValueObject);
    }
  }
}
