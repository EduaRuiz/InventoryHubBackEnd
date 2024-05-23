/**
 * Valida la longitud del string recibido dado un rango también envidado dentro del rango min >= value.length <= max
 *
 * @param {string} value
 * @param {number} min
 * @param {number} max
 * @return {*}  {boolean}
 */
export const StringRangeLength = (
  value: string,
  min: number,
  max: number,
): boolean => {
  return value?.trim().length > max
    ? false
    : value?.length < min
      ? false
      : true;
};
