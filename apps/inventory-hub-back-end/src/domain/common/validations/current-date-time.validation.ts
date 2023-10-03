/**
 * Recibe dos valores Date para comparar si la diferencia entre ambos no supera 1 segundo
 *
 * @param {Date} value
 * @param {Date} now
 * @return {*}  {boolean}
 */
export const CurrentDateTimeValidation = (value: Date, now: Date): boolean => {
  return !(Math.abs(value.getTime() - now.getTime()) > 1000);
};
