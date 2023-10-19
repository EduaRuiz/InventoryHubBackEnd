jest.mock('@domain/common/validations');
import { BranchIdValueObject } from '.';

describe('BranchIdValueObject', () => {
  const mockCheckIsUUID4 = jest.requireMock('@validations').IsUUID4;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    it('should not set error if value is a valid UUID v4', () => {
      // Arrange
      const validUUID = '56352ab1-2118-4112-9e82-70df36a7d0af';
      mockCheckIsUUID4.mockReturnValue(true);
      const branchId = new BranchIdValueObject(validUUID);
      const expected = false;

      // Act
      branchId.validateData();

      // Assert
      expect(branchId.hasErrors()).toBe(expected);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(validUUID);
    });

    it('should set error if id is not a valid UUID', () => {
      // Arrange
      const invalidUUID = 'not-a-uuid';
      mockCheckIsUUID4.mockReturnValue(false);
      const branchId = new BranchIdValueObject(invalidUUID);
      const expected = true;
      const expectedField = 'BranchId';
      const expectedMessage = 'El id no tine un formato de UUID válido';

      // Act
      branchId.validateData();

      // Assert
      expect(branchId.hasErrors()).toBe(expected);
      expect(branchId.getErrors()[0]?.field).toBe(expectedField);
      expect(branchId.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(invalidUUID);
    });
  });
});
