import { UserDomainModel } from '..';
import { IErrorValueObject } from '@sofka/interfaces';

describe('UserDomainModel', () => {
  it('should create UserDomainModel instance', () => {
    // Arrange
    const fullName = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'password123';
    const role = 'admin';
    const branchId = 'branch-id';
    const id = 'user-id';

    // Act
    const user = new UserDomainModel(
      fullName,
      email,
      password,
      role,
      branchId,
      id,
    );

    // Assert
    expect(user.fullName).toBe(fullName.toUpperCase().trim());
    expect(user.email).toBe(email.trim());
    expect(user.password).toBe(password);
    expect(user.role).toBe(role);
    expect(user.branchId).toBe(branchId);
    expect(user.id).toBe(id);
  });

  it('should validate value objects and return no errors', () => {
    // Arrange
    const fullName = 'John Doe';
    const email = 'john.doe@example.com';
    const password = 'Password123';
    const role = 'admin';
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const user = new UserDomainModel(fullName, email, password, role, branchId);

    // Act
    const errors: IErrorValueObject[] = user.getErrors();

    // Assert
    expect(errors).toEqual([]);
    expect(user.hasErrors()).toBe(false);
  });

  it('should validate value objects and return errors for invalid email', () => {
    // Arrange
    const fullName = 'John Doe';
    const email = 'invalid-email';
    const password = 'Password123';
    const role = 'admin';
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const user = new UserDomainModel(fullName, email, password, role, branchId);

    // Act
    const errors: IErrorValueObject[] = user.getErrors();

    // Assert
    expect(errors).toEqual([
      {
        field: 'UserEmail',
        message: 'No es un correo electrónico válido',
      },
    ]);
    expect(user.hasErrors()).toBe(true);
  });
});
