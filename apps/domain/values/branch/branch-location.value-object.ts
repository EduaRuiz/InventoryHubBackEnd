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
    if (this.value && !StringRangeLength(this.value.city, 3, 100)) {
      this.setError({
        field: 'BranchLocation.city',
        message:
          'La longitud del nombre de la ciudad no se encuentra dentro del rango min: 3 y max: 100',
      } as IErrorValueObject);
    }
    if (this.value && !StringRangeLength(this.value.country, 3, 50)) {
      this.setError({
        field: 'BranchLocation.country',
        message:
          'La longitud del nombre del país no se encuentra dentro del rango min: 3 y max: 50',
      } as IErrorValueObject);
    }
  }
}
