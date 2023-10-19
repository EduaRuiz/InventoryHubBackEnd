jest.mock('@domain/common/validations');
import { SaleDateValueObject } from './sale-date.value-object';

describe('SaleDateValueObject', () => {
  const mockCheckIsEmpty = jest.requireMock('@validations').IsEmptyValidation;
  const mockStringDateTimeValidation =
    jest.requireMock('@validations').CurrentDateTimeValidation;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    let saleDate: SaleDateValueObject;
    it('should set error if SaleDate is empty', () => {
      // Arrange
      const emptyDate = '' as unknown as Date;
      mockCheckIsEmpty.mockReturnValue(true);
      mockStringDateTimeValidation.mockReturnValue(false);
      saleDate = new SaleDateValueObject(emptyDate);

      // Act
      saleDate.validateData();

      // Assert
      expect(saleDate.hasErrors()).toBe(true);
      expect(saleDate.getErrors()[0]?.field).toBe('Date');
      expect(saleDate.getErrors()[0]?.message).toBe(
        'La fecha no puede ser vacía',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(emptyDate);
      expect(mockStringDateTimeValidation).not.toHaveBeenCalled();
    });

    it('should set error if SaleDate length is not within the range', () => {
      // Arrange
      const invalidName = new Date(Date.now() + 100000);
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringDateTimeValidation.mockReturnValue(true);
      saleDate = new SaleDateValueObject(invalidName);

      // Act
      saleDate.validateData();

      // Assert
      expect(saleDate.hasErrors()).toBe(true);
      expect(saleDate.getErrors()[0]?.field).toBe('Date');
      expect(saleDate.getErrors()[0]?.message).toBe(
        'La fecha de la venta no puede ser mayor a la fecha actual',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(invalidName);
    });

    it('should not set errors if SaleDate is valid', () => {
      // Arrange
      const validName = new Date();
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringDateTimeValidation.mockReturnValue(false);
      saleDate = new SaleDateValueObject(validName);

      // Act
      saleDate.validateData();

      // Assert
      expect(saleDate.hasErrors()).toBe(false);
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(validName);
    });
  });
});
