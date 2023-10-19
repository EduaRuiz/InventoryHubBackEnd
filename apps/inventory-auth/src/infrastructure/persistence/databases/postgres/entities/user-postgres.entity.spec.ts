import { UserPostgresEntity } from '..';

describe('UserPostgresEntity', () => {
  const id = 'testId';
  const fullName = 'testFullName';
  const email = 'testEmail';
  const password = 'testPassword';
  const role = 'testRole';
  const branchId = 'testBranchId';

  it('should be defined', () => {
    //Arrange & Act
    const user = new UserPostgresEntity(
      id,
      fullName,
      email,
      password,
      role,
      branchId,
    );

    //Assert
    expect(user).toBeDefined();
  });
});
