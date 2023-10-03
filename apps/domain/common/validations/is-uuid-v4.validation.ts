import { validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * Valida mediante la biblioteca de UUID v4 si el string enviado cumple con la estructura
 *
 * @param {string} value
 * @return {*}  {boolean}
 */
export const IsUUID4 = (value: string): boolean => {
  return uuidValidate(value) && uuidVersion(value) === 4;
};
