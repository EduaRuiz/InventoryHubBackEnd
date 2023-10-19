import { IsEmptyValidation } from '.';

describe('IsEmptyValidation', () => {
  describe('when the input value is empty', () => {
    it('should return true for an empty string', () => {
      // Arrange
      const value = '';
      const expected = true;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for null', () => {
      // Arrange
      const value = null;
      const expected = true;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for undefined', () => {
      // Arrange
      const value = undefined;
      const expected = true;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for an empty array', () => {
      // Arrange
      const value: any[] = [];
      // Act
      const result = IsEmptyValidation(value);
      const expected = true;
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for an empty object', () => {
      // Arrange
      const value = {};
      const expected = true;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('when the input value is not empty', () => {
    it('should return false for a non-empty string', () => {
      // Arrange
      const value = 'a';
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a non-empty array', () => {
      // Arrange
      const value = [1, 2, 3];
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a non-empty object', () => {
      // Arrange
      const value = { a: 'a' };
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a boolean value', () => {
      // Arrange
      const value = true;
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a boolean value', () => {
      // Arrange
      const value = false;
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a number value', () => {
      // Arrange
      const value = 0;
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a bigint value', () => {
      // Arrange
      const value = 0n;
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a date value', () => {
      // Arrange
      const value = new Date();
      const expected = false;
      // Act
      const result = IsEmptyValidation(value);
      // Assert
      expect(result).toBe(expected);
    });
  });
});
