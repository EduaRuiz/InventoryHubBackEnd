import { BadRequestSwagger } from '..';

describe('BadRequestSwagger', () => {
  it('should create an instance of BadRequestSwagger with the correct values', () => {
    // Arrange and Act
    const badRequestSwagger = new BadRequestSwagger();

    // Assert
    expect(badRequestSwagger).toBeInstanceOf(BadRequestSwagger);
  });
});
