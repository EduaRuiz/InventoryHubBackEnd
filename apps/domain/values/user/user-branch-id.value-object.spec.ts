jest.mock('@domain/common/validations');
import { UserBranchIdValueObject } from '.';

describe('UserBranchIdValueObject', () => {
  const mockCheckIsUUID4 = jest.requireMock('@validations').IsUUID4;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    it('should not set error if value is a valid UUID v4', () => {
      // Arrange
      const validUUID = '56352ab1-2118-4112-9e82-70df36a7d0af';
      mockCheckIsUUID4.mockReturnValue(true);
      const userBranchId = new UserBranchIdValueObject(validUUID);
      const expected = false;

      // Act
      userBranchId.validateData();

      // Assert
      expect(userBranchId.hasErrors()).toBe(expected);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(validUUID);
    });

    it('should set error if id is not a valid UUID', () => {
      // Arrange
      const invalidUUID = 'not-a-uuid';
      mockCheckIsUUID4.mockReturnValue(false);
      const userBranchId = new UserBranchIdValueObject(invalidUUID);
      const expected = true;
      const expectedField = 'BranchId';
      const expectedMessage = 'El id no tine un formato de UUID válido';

      // Act
      userBranchId.validateData();

      // Assert
      expect(userBranchId.hasErrors()).toBe(expected);
      expect(userBranchId.getErrors()[0]?.field).toBe(expectedField);
      expect(userBranchId.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(invalidUUID);
    });
  });
});
