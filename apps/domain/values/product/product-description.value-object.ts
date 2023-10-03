import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';

export class ProductDescriptionValueObject extends ValueObjectBase<string> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'ProductDescription',
        message: 'La descripción no puede ser vacía',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (this.value && !StringRangeLength(this.value, 3, 255)) {
      this.setError({
        field: 'ProductDescription',
        message:
          'La longitud de la descripción no se encuentra dentro del rango min: 3 y max: 255',
      } as IErrorValueObject);
    }
  }
}
