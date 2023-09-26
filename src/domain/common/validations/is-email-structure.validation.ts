/**
 * Valida si el valor suministrado cumple con la estructura de un mail (RFC2822)
 *
 * @param {string} value
 * @return {*}  {boolean}
 */
export const IsEmailStructureValidation = (value: string): boolean => {
  const regex = new RegExp(
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  );
  return regex.test(value);
};
