export const IsInEnumValidation = (value: string, enumObject: any): boolean => {
  return Object.values(enumObject).includes(value);
};
