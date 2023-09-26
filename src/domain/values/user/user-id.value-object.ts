import { v4 as uuid } from 'uuid';

import { IsUUID4 } from '@validations';
import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';

export class UserIdValueObject extends ValueObjectBase<string> {
  constructor(value?: string) {
    super(value ?? uuid());
  }

  validateData(): void {
    this.validateStructure();
  }
  private validateStructure(): void {
    if (this.value && !IsUUID4(this.value)) {
      this.setError({
        field: 'UserId',
        message: 'El "UserId" no tine un formato de UUID válido',
      } as IErrorValueObject);
    }
  }
}
