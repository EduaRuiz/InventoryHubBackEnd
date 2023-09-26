export const IsPasswordValidation = (value: string): boolean => {
  // Al menos 8 caracteres, incluyendo al menos una letra mayúscula, una minúscula y un número
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(value);
};
