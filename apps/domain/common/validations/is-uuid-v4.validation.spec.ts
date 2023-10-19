import { IsUUID4 } from '.';

describe('IsUUID4', () => {
  describe('when is not an UUID', () => {
    it('should return false for a invalid UUID', () => {
      // Arrange
      const uuid = 'f85b40cs-003d-4d58-a06e-75fd4f0741b4';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a invalid UUID', () => {
      // Arrange
      const uuid = 'La luna es redonda y blanca como queso';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for another valid UUID', () => {
      // Arrange
      const uuid = '11111111-1111-1111-1111-111111111111';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('when the UUID is version 4', () => {
    it('should return true for a valid UUID v4', () => {
      // Arrange
      const uuid = 'f85b40c9-003d-4d58-a06e-75fd4f0741b4';
      const expected = true;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return true for another valid UUID v4', () => {
      // Arrange
      const uuid = 'e6b0e6f5-6c7d-4d4c-b7f4-583369c9dc1d';
      const expected = true;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });
  });

  describe('when the UUID is not version 4', () => {
    it('should return false for a UUID v1', () => {
      // Arrange
      const uuid = '0b0f7cc0-27e1-11ec-82a8-0242ac130003';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a UUID v3', () => {
      // Arrange
      const uuid = 'a2dcd2f2-85a9-3039-932d-25e968ce44b1';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for a UUID v5', () => {
      // Arrange
      const uuid = '2a7e97d3-86c7-586f-a2ee-7c9693f0e1c3';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });

    it('should return false for an invalid UUID', () => {
      // Arrange
      const uuid = 'not-a-uuid';
      const expected = false;
      // Act
      const result = IsUUID4(uuid);
      // Assert
      expect(result).toBe(expected);
    });
  });
});
