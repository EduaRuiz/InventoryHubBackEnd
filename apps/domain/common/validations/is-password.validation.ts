import { PASSWORD_REGEX } from '@domain-common/regex';
export const IsPasswordValidation = (value: string): boolean => {
  return new RegExp(PASSWORD_REGEX).test(value);
};
