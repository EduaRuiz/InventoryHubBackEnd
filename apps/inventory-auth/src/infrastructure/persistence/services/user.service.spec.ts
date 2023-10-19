import { UserPostgresService, UserService } from '..';

describe('UserService', () => {
  // Arrange
  let userService: UserService;

  describe('when instantiated', () => {
    it('should extend UserPostgresService class', () => {
      // Act
      userService = new UserService({} as any);

      // Assert
      expect(userService).toBeInstanceOf(UserPostgresService);
    });
  });
});
