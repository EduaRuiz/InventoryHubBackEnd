import { IsInEnumValidation } from '.';

// Supongamos que este es tu objeto de enumeración (puedes adaptarlo según tus necesidades)
enum Color {
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
}

describe('IsInEnumValidation', () => {
  it('should return true for a valid value in the enum', () => {
    // Arrange
    const validValue = Color.Red;
    // Act and Assert
    expect(IsInEnumValidation(validValue, Color)).toBe(true);
  });

  it('should return false for a value not present in the enum', () => {
    // Arrange
    const invalidValue = 'Yellow'; // Suponiendo que 'Yellow' no está en el enum Color
    // Act and Assert
    expect(IsInEnumValidation(invalidValue, Color)).toBe(false);
  });

  it('should return false for an undefined value', () => {
    // Arrange
    const undefinedValue: string = undefined as any;
    // Act and Assert
    expect(IsInEnumValidation(undefinedValue, Color)).toBe(false);
  });

  it('should return false for a null value', () => {
    // Arrange
    const nullValue = null as any;
    // Act and Assert
    expect(IsInEnumValidation(nullValue, Color)).toBe(false);
  });

  it('should return false for a number', () => {
    // Arrange
    const numberValue = 42 as any; // Número que no está en el enum Color
    // Act and Assert
    expect(IsInEnumValidation(numberValue, Color)).toBe(false);
  });

  it('should return false for an object', () => {
    // Arrange
    const objectValue = { key: 'value' } as any; // Objeto que no está en el enum Color
    // Act and Assert
    expect(IsInEnumValidation(objectValue, Color)).toBe(false);
  });
});
