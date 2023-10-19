import { IsPasswordValidation } from '.';

describe('IsPasswordValidation', () => {
  it('should return true for a valid password that meets the criteria', () => {
    // Arrange
    const validPasswords = [
      'Password123',
      'StrongPassw0rd',
      'Secur3Pssword',
      'MyPssw0rd123',
    ];
    // Act and Assert
    validPasswords.forEach((password) => {
      expect(IsPasswordValidation(password)).toBe(true);
    });
  });

  it('should return false for a password without uppercase letter', () => {
    // Arrange
    const invalidPassword = 'password123!';
    // Act and Assert
    expect(IsPasswordValidation(invalidPassword)).toBe(false);
  });

  it('should return false for a password without lowercase letter', () => {
    // Arrange
    const invalidPassword = 'PASSWORD123!';
    // Act and Assert
    expect(IsPasswordValidation(invalidPassword)).toBe(false);
  });

  it('should return false for a password without a digit', () => {
    // Arrange
    const invalidPassword = 'Password!';
    // Act and Assert
    expect(IsPasswordValidation(invalidPassword)).toBe(false);
  });

  it('should return false for a password without a special character', () => {
    // Arrange
    const invalidPassword = 'Password@123';
    // Act and Assert
    expect(IsPasswordValidation(invalidPassword)).toBe(false);
  });

  it('should return false for a password that is too short', () => {
    // Arrange
    const invalidPassword = 'P@ss1';
    // Act and Assert
    expect(IsPasswordValidation(invalidPassword)).toBe(false);
  });
});
