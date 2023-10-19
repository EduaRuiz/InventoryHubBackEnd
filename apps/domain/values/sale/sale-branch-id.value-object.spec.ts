jest.mock('@domain/common/validations');
import { SaleBranchIdValueObject } from '.';

describe('SaleBranchIdValueObject', () => {
  const mockCheckIsUUID4 = jest.requireMock('@validations').IsUUID4;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    it('should not set error if value is a valid UUID v4', () => {
      // Arrange
      const validUUID = '56352ab1-2118-4112-9e82-70df36a7d0af';
      mockCheckIsUUID4.mockReturnValue(true);
      const saleBranchId = new SaleBranchIdValueObject(validUUID);
      const expected = false;

      // Act
      saleBranchId.validateData();

      // Assert
      expect(saleBranchId.hasErrors()).toBe(expected);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(validUUID);
    });

    it('should set error if id is not a valid UUID', () => {
      // Arrange
      const invalidUUID = 'not-a-uuid';
      mockCheckIsUUID4.mockReturnValue(false);
      const saleBranchId = new SaleBranchIdValueObject(invalidUUID);
      const expected = true;
      const expectedField = 'BranchId';
      const expectedMessage = 'El id no tine un formato de UUID válido';

      // Act
      saleBranchId.validateData();

      // Assert
      expect(saleBranchId.hasErrors()).toBe(expected);
      expect(saleBranchId.getErrors()[0]?.field).toBe(expectedField);
      expect(saleBranchId.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(invalidUUID);
    });
  });
});
