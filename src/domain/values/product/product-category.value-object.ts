﻿import { ValueObjectBase } from '@sofka/bases';
import { IErrorValueObject } from '@sofka/interfaces';
import { IsEmptyValidation, IsInEnumValidation } from '@validations';
import { ProductCategoryEnum } from '../../enums';

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
        message: `La categoría debe estar dentro de las siguientes: Herramientas Manuales, Herramientas Eléctricas, Cerrajería, Ferretería para la Construcción, Pintura y Accesorios, Jardinería y Exteriores, Equipamiento de Seguridad y Protección, Materiales para Fontanería, Electricidad, Artículos para el Hogar`,
      } as IErrorValueObject);
    }
  }
}
