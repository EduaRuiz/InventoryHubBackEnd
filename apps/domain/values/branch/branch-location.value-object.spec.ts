jest.mock('@domain/common/validations');

import { BranchLocationValueObject } from '.';

describe('BranchLocationValueObject', () => {
  const mockCheckIsEmpty = jest.requireMock('@validations').IsEmptyValidation;
  const mockStringRangeLength =
    jest.requireMock('@validations').StringRangeLength;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    let branchLocation: BranchLocationValueObject;

    it('should set error if Location is empty', () => {
      // Arrange
      const emptyLocation = { city: '', country: '' };
      mockCheckIsEmpty.mockReturnValue(true);
      branchLocation = new BranchLocationValueObject(emptyLocation);
      const expected = true;
      const expectedField = 'BranchLocation';
      const expectedMessage = 'El Location no puede ser vacío';

      // Act
      branchLocation.validateData();

      // Assert
      expect(branchLocation.hasErrors()).toBe(expected);
      expect(branchLocation.getErrors()[0]?.field).toBe(expectedField);
      expect(branchLocation.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(emptyLocation);
      expect(mockStringRangeLength).not.toHaveBeenCalled();
    });

    it('should set error if city length is not within the range', () => {
      // Arrange
      const invalidLocation = { city: 'A', country: 'Country' };
      mockStringRangeLength.mockReturnValue(false);
      mockCheckIsEmpty.mockReturnValue(false);
      branchLocation = new BranchLocationValueObject(invalidLocation);
      const expected = true;
      const expectedField = 'BranchLocation.city';
      const expectedMessage =
        'La longitud del nombre de la ciudad no se encuentra dentro del rango min: 3 y max: 100';

      // Act
      branchLocation.validateData();

      // Assert
      expect(branchLocation.hasErrors()).toBe(expected);
      expect(branchLocation.getErrors()[0]?.field).toBe(expectedField);
      expect(branchLocation.getErrors()[0]?.message).toBe(expectedMessage);
      expect(mockCheckIsEmpty).toHaveBeenCalled();
      expect(mockStringRangeLength).toHaveBeenCalledWith(
        invalidLocation.city,
        3,
        100,
      );
    });

    it('should not set errors if Location is valid', () => {
      // Arrange
      const validLocation = { city: 'Valid City', country: 'Valid Country' };
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringRangeLength.mockReturnValue(true);
      branchLocation = new BranchLocationValueObject(validLocation);
      const expected = false;

      // Act
      branchLocation.validateData();

      // Assert
      expect(branchLocation.hasErrors()).toBe(expected);
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(validLocation);
      expect(mockStringRangeLength).toHaveBeenCalledWith(
        validLocation.city,
        3,
        100,
      );
      expect(mockStringRangeLength).toHaveBeenCalledWith(
        validLocation.country,
        3,
        50,
      );
    });
  });
});
