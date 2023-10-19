import { TypeNameEnum } from '@domain/enums';
import { UserEntity } from '..';

describe('UserEntity', () => {
  let event: UserEntity;
  const fullName = 'sampleFullName';
  const email = 'sampleEmail';
  const password = 'samplePassword';
  const role = 'sampleRole';
  const branchId = 'sampleBranchId';

  beforeEach(() => {
    event = new UserEntity(
      fullName,
      email,
      password,
      role,
      branchId,
      TypeNameEnum.USER_REGISTERED,
    );
  });

  it('should be defined and be an instance of UserEntity', () => {
    // Assert
    expect(event).toBeDefined();
    expect(event instanceof UserEntity).toBeTruthy();
  });
});
