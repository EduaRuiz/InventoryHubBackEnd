import { CurrentDateTimeValidation } from '.';

describe('CurrentDateTimeValidation', () => {
  describe(`when the difference between the two dates is 
  less than or equal to the tolerance`, () => {
    it('should return true', () => {
      // Arrange
      const value = new Date('2023-03-10T12:00:00.000Z');
      const now = new Date('2023-03-10T12:00:00.000Z');
      const expected = false;

      // Act
      const result = CurrentDateTimeValidation(value, now);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe(`when the difference between the two dates is
  greater than the tolerance`, () => {
    it('should return false', () => {
      // Arrange
      const value = new Date('2023-03-10T12:00:00.000Z');
      const now = new Date('2023-03-10T12:01:02.000Z');
      const expected = true;

      // Act
      const result = CurrentDateTimeValidation(value, now);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
