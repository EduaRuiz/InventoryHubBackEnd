jest.mock('@domain/common/validations');
import { BranchNameValueObject } from './branch-name.value-object';

describe('BranchNameValueObject', () => {
  const mockCheckIsEmpty = jest.requireMock('@validations').IsEmptyValidation;
  const mockStringRangeLength =
    jest.requireMock('@validations').StringRangeLength;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    let branchName: BranchNameValueObject;
    it('should set error if BranchName is empty', () => {
      // Arrange
      const emptyName = '';
      mockCheckIsEmpty.mockReturnValue(true);
      mockStringRangeLength.mockReturnValue(false);
      branchName = new BranchNameValueObject(emptyName);

      // Act
      branchName.validateData();

      // Assert
      expect(branchName.hasErrors()).toBe(true);
      expect(branchName.getErrors()[0]?.field).toBe('BranchName');
      expect(branchName.getErrors()[0]?.message).toBe(
        'El nombre no puede ser vacío',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(emptyName);
      expect(mockStringRangeLength).not.toHaveBeenCalled();
    });

    it('should set error if BranchName length is not within the range', () => {
      // Arrange
      const invalidName = 'A';
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringRangeLength.mockReturnValue(false);
      branchName = new BranchNameValueObject(invalidName);

      // Act
      branchName.validateData();

      // Assert
      expect(branchName.hasErrors()).toBe(true);
      expect(branchName.getErrors()[0]?.field).toBe('BranchName');
      expect(branchName.getErrors()[0]?.message).toBe(
        'La longitud del nombre no se encuentra dentro del rango min: 3 y max: 100',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(invalidName);
      expect(mockStringRangeLength).toHaveBeenCalledWith(invalidName, 3, 100);
    });

    it('should not set errors if BranchName is valid', () => {
      // Arrange
      const validName = 'Valid Branch Name';
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringRangeLength.mockReturnValue(true);
      branchName = new BranchNameValueObject(validName);

      // Act
      branchName.validateData();

      // Assert
      expect(branchName.hasErrors()).toBe(false);
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(validName);
      expect(mockStringRangeLength).toHaveBeenCalledWith(validName, 3, 100);
    });
  });
});
