import { EMAIL_REGEX } from '@domain-common/regex';

/**
 * Valida si el valor suministrado cumple con la estructura de un mail (RFC2822)
 *
 * @param {string} value
 * @return {*}  {boolean}
 */
export const IsEmailStructureValidation = (value: string): boolean => {
  return new RegExp(EMAIL_REGEX).test(value);
};
