import { NumberRangeValidation } from '.';

describe('NumberRangeValidation', () => {
  describe('when the value is within the range', () => {
    it('should return true for a value equal to the minimum', () => {
      // Arrange
      const value = 5;
      const min = 5;
      const max = 10;
      const expected = true;
      // Act
      const result = NumberRangeValidation(value, min, max);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for a value equal to the maximum', () => {
      // Arrange
      const value = 10;
      const min = 5;
      const max = 10;
      const expected = true;
      // Act
      const result = NumberRangeValidation(value, min, max);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for a value within the range', () => {
      // Arrange
      const value = 7;
      const min = 5;
      const max = 10;
      const expected = true;
      // Act
      const result = NumberRangeValidation(value, min, max);
      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('when the value is outside the range', () => {
    it('should return false for a value less than the minimum', () => {
      // Arrange
      const value = 3;
      const min = 5;
      const max = 10;
      const expected = false;
      // Act
      const result = NumberRangeValidation(value, min, max);

      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a value greater than the maximum', () => {
      // Arrange
      const value = 12;
      const min = 5;
      const max = 10;
      const expected = false;
      // Act
      const result = NumberRangeValidation(value, min, max);
      // Assert
      expect(result).toBe(expected);
    });
  });
});
