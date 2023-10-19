jest.mock('@domain/common/validations');
import { SaleIdValueObject } from '.';

describe('SaleIdValueObject', () => {
  const mockCheckIsUUID4 = jest.requireMock('@validations').IsUUID4;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    it('should not set error if value is a valid UUID v4', () => {
      // Arrange
      const validUUID = '56352ab1-2118-4112-9e82-70df36a7d0af';
      mockCheckIsUUID4.mockReturnValue(true);
      const saleId = new SaleIdValueObject(validUUID);
      const expected = false;

      // Act
      saleId.validateData();

      // Assert
      expect(saleId.hasErrors()).toBe(expected);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(validUUID);
    });

    it('should set error if id is not a valid UUID', () => {
      // Arrange
      const invalidUUID = 'not-a-uuid';
      mockCheckIsUUID4.mockReturnValue(false);
      const saleId = new SaleIdValueObject(invalidUUID);
      const expected = true;
      const expectedField = 'SaleId';
      const expectedMessage = 'El id no tine un formato de UUID válido';

      // Act
      saleId.validateData();

      // Assert
      expect(saleId.hasErrors()).toBe(expected);
      expect(saleId.getErrors()[0]?.field).toBe(expectedField);
      expect(saleId.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsUUID4).toHaveBeenCalledWith(invalidUUID);
    });
  });
});
