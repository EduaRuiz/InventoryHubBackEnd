import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, StringRangeLength } from '@validations';
import { Location } from '@types';

export class BranchLocationValueObject extends ValueObjectBase<Location> {
  validateData(): void {
    if (IsEmptyValidation(this.value)) {
      this.setError({
        field: 'BranchLocation',
        message: 'El Location no puede ser vacío',
      } as IErrorValueObject);
    } else {
      this.validateLength();
    }
  }

  private validateLength(): void {
    if (
      this.value &&
      !StringRangeLength(
        this.value.city,
        5,
        255 || !StringRangeLength(this.value.country, 5, 255),
      )
    ) {
      this.setError({
        field: 'BranchLocation',
        message:
          'La longitud de la ubicación no se encuentra dentro del rango min: 5 y max: 255',
      } as IErrorValueObject);
    }
  }
}
