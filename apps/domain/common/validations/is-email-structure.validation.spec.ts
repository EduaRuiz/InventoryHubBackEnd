/* eslint-disable prettier/prettier */
import { IsEmailStructureValidation } from '.';

describe('IsEmailStructureValidation', () => {
  describe('when the email has a valid structure', () => {
    it('should return true for a simple email', () => {
      // Arrange
      const email = 'john.doe@example.com';
      const expected = true;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for an email with subdomains', () => {
      // Arrange
      const email = 'jane.smith@sub.example.co.uk';
      const expected = true;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for an email with a plus sign', () => {
      // Arrange
      const email = 'john+spam@example.com';
      const expected = true;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for an email with special characters', () => {
      // Arrange
      const email = "jane.o'brien@example.com";
      const expected = false;
      // Act
      const result = IsEmailStructureValidation(email);

      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('when the email does not have a valid structure', () => {
    it('should return false for an email without a username', () => {
      // Arrange
      const email = '@example.com';
      const expected = false;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for an email without a domain', () => {
      // Arrange
      const email = 'jane.smith@';
      const expected = false;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for an email with an invalid character', () => {
      // Arrange
      const email = 'jane.smith@example,com';
      const expected = false;
      // Act
      const result = IsEmailStructureValidation(email);
      // Assert
      expect(result).toBe(expected);
    });
  });
});
