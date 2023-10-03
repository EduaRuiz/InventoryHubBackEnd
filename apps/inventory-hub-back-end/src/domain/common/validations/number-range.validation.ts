/**
 * Valida si el numero enviado a partir del value se encuentra dentro del rango min >= value <= max
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @return {*}  {boolean}
 */
export const NumberRangeValidation = (
  value: number,
  min: number,
  max: number,
): boolean => {
  return value > max ? false : value < min ? false : true;
};
