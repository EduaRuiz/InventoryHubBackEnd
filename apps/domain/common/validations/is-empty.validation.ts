/**
 * Valida si cualquier tipo de valor enviado dentro de los siguientes se encuentra vacío:
 * boolean | number | bigint | [] | object | string | null | undefined
 *
 * @param {(boolean | number | bigint | [] | object | string | null | undefined)} value
 * @return {*}  {boolean}
 */
export const IsEmptyValidation = (
  value:
    | Date
    | boolean
    | number
    | bigint
    | []
    | object
    | string
    | null
    | undefined,
): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return isNaN(value.getTime()); // Consider Date as empty if it's an invalid date
    }
    return Object.keys(value).length === 0;
  }
  return false;
};
