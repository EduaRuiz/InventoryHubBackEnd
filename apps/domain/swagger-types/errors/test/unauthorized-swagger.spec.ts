import { UnauthorizedSwagger } from '..';

describe('UnauthorizedSwagger', () => {
  it('should create an instance of UnauthorizedSwagger with the correct values', () => {
    // Arrange and Act
    const unauthorizedSwagger = new UnauthorizedSwagger();

    // Assert
    expect(unauthorizedSwagger).toBeInstanceOf(UnauthorizedSwagger);
  });
});
