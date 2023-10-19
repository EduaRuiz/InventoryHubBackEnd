jest.mock('@domain/common/validations');
import { UserNameValueObject } from './user-name.value-object';

describe('UserNameValueObject', () => {
  const mockCheckIsEmpty = jest.requireMock('@validations').IsEmptyValidation;
  const mockStringRangeLength =
    jest.requireMock('@validations').StringRangeLength;
  beforeEach(() => jest.clearAllMocks());
  describe('validateData', () => {
    let userName: UserNameValueObject;
    it('should set error if UserName is empty', () => {
      // Arrange
      const emptyName = {
        firstName: '',
        lastName: '',
      };
      mockCheckIsEmpty.mockReturnValue(true);
      mockStringRangeLength.mockReturnValue(false);
      userName = new UserNameValueObject(emptyName);

      // Act
      userName.validateData();

      // Assert
      expect(userName.hasErrors()).toBe(true);
      expect(userName.getErrors()[0]?.field).toBe('UserName');
      expect(userName.getErrors()[0]?.message).toBe(
        'El nombre no puede ser vacío',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(emptyName);
      expect(mockStringRangeLength).not.toHaveBeenCalled();
    });

    it('should set error if UserName length is not within the range', () => {
      // Arrange
      const invalidName = { firstName: 'AndresMock', lastName: 'A' };
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringRangeLength.mockReturnValue(false);
      userName = new UserNameValueObject(invalidName);

      // Act
      userName.validateData();

      // Assert
      expect(userName.hasErrors()).toBe(true);
      expect(userName.getErrors()[0]?.field).toBe('UserName');
      expect(userName.getErrors()[0]?.message).toBe(
        'La longitud del nombre no se encuentra dentro del rango min: 3 y max: 100',
      );
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(invalidName);
    });

    it('should not set errors if UserName is valid', () => {
      // Arrange
      const validName = {
        firstName: 'Valid Name',
        lastName: 'Valid Last Name',
      };
      mockCheckIsEmpty.mockReturnValue(false);
      mockStringRangeLength.mockReturnValue(true);
      userName = new UserNameValueObject(validName);

      // Act
      userName.validateData();

      // Assert
      expect(userName.hasErrors()).toBe(false);
      expect(mockCheckIsEmpty).toHaveBeenCalledWith(validName);
    });
  });
});
