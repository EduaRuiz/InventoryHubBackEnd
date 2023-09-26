/**
 * Valida si el dominio del correo coincide con el dominio enviado
 *
 * @param {string} value
 * @param {string} domain
 * @return {*}  {boolean}
 */
export const IsInstitutionalMailValidation = (
  value: string,
  domain: string,
): boolean => {
  const index = value.indexOf(domain);
  return index === -1
    ? false
    : value.length - domain.length !== index
    ? false
    : true;
};
