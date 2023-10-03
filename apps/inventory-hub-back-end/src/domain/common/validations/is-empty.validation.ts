/**
 * Valida si cualquier tipo de valor enviado dentro de los siguientes se encuentra vacío:
 * boolean | number | bigint | [] | object | string | null | undefined
 *
 * @param {(boolean | number | bigint | [] | object | string | null | undefined)} value
 * @return {*}  {boolean}
 */
export const IsEmptyValidation = (
  value: boolean | number | bigint | [] | object | string | null | undefined,
): boolean => {
  if (typeof value === 'string') return value.trim() === '' ? true : false;
  else if (value === null || value === undefined) return true;
  else if (typeof value === 'object')
    return Object.keys(value).length === 0 ? true : false;
  return false;
};
