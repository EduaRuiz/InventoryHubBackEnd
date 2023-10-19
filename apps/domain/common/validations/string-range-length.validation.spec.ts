import { StringRangeLength } from '.';

describe('StringRangeLength', () => {
  // Test case 1
  it('should return true when length is within range', () => {
    // Arrange
    const value = 'hello world';
    const min = 5;
    const max = 20;
    const expected = true;
    // Act
    const result = StringRangeLength(value, min, max);
    // Assert
    expect(result).toEqual(expected);
  });

  // Test case 2
  it('should return false when length is less than min', () => {
    // Arrange
    const value = 'hello';
    const min = 10;
    const max = 20;
    const expected = false;
    // Act
    const result = StringRangeLength(value, min, max);
    // Assert
    expect(result).toEqual(expected);
  });

  // Test case 3
  it('should return false when length is greater than max', () => {
    // Arrange
    const value = 'hello world';
    const min = 1;
    const max = 5;
    const expected = false;
    // Act
    const result = StringRangeLength(value, min, max);
    // Assert
    expect(result).toEqual(expected);
  });

  // Test case 4
  it('should ignore leading/trailing white spaces in value', () => {
    // Arrange
    const value = '    hello world     ';
    const min = 5;
    const max = 20;
    const expected = true;
    // Act
    const result = StringRangeLength(value, min, max);
    // Assert
    expect(result).toEqual(expected);
  });
});
