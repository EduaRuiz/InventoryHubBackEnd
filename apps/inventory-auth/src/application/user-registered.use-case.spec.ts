import { UserRegisteredUseCase } from './user-registered.use-case';
import { IUserAuthDomainService } from '@domain-services';
import { EventDomainModel, UserDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { Observable, of, throwError } from 'rxjs';
import { TypeNameEnum, UserRoleEnum } from '@domain';

describe('UserRegisteredUseCase', () => {
  let userRegisteredUseCase: UserRegisteredUseCase;
  let mockUserAuthService: IUserAuthDomainService;

  beforeEach(() => {
    mockUserAuthService = {
      registerUser: jest.fn(),
    } as unknown as IUserAuthDomainService;

    userRegisteredUseCase = new UserRegisteredUseCase(mockUserAuthService);
  });

  describe('execute', () => {
    it('should register a user and return the registered user', (done) => {
      // Arrange
      const userRegisteredEvent: EventDomainModel = {
        eventBody: {
          fullName: 'John Doe',
          email: 'johndoe@example.com',
          password: 'Password123',
          role: UserRoleEnum.ADMIN,
          branchId: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
          id: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
        },
        aggregateRootId: '123',
        occurredOn: new Date(),
        typeName: TypeNameEnum.USER_REGISTERED,
      };

      const registeredUser: UserDomainModel = {
        ...userRegisteredEvent.eventBody,
      } as UserDomainModel;
      jest
        .spyOn(mockUserAuthService, 'registerUser')
        .mockReturnValue(of(registeredUser));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisteredUseCase.execute(userRegisteredEvent);

      // Assert
      result.subscribe({
        next: (user: UserDomainModel) => {
          expect(user).toBe(registeredUser);
          expect(mockUserAuthService.registerUser).toHaveBeenCalledWith(
            expect.any(UserDomainModel),
          );
          done();
        },
        error: (err: any) => {
          done.fail(err);
        },
      });
    });

    it('should throw ValueObjectException if user data is invalid', (done) => {
      // Arrange
      const userRegisteredEvent: EventDomainModel = {
        eventBody: {
          fullName: '',
          email: '',
          password: 'Password123',
          role: UserRoleEnum.ADMIN,
          branchId: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
          id: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
        },
        aggregateRootId: '123',
        occurredOn: new Date(),
        typeName: TypeNameEnum.USER_REGISTERED,
      };

      const registeredUser: UserDomainModel = {
        ...userRegisteredEvent.eventBody,
      } as UserDomainModel;

      jest
        .spyOn(mockUserAuthService, 'registerUser')
        .mockReturnValue(of(registeredUser));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisteredUseCase.execute(userRegisteredEvent);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(ValueObjectException);
          expect(mockUserAuthService.registerUser).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw error if user service throws error', (done) => {
      // Arrange
      const userRegisteredEvent: EventDomainModel = {
        eventBody: {
          fullName: 'John Doe',
          email: 'johndoe@example.com',
          password: 'Password123',
          role: UserRoleEnum.ADMIN,
          branchId: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
          id: '59f38f33-0603-4ebc-9eac-0428a6ecf758',
        },
        aggregateRootId: '123',
        occurredOn: new Date(),
        typeName: TypeNameEnum.USER_REGISTERED,
      };
      const error = new Error('User service error');
      jest
        .spyOn(mockUserAuthService, 'registerUser')
        .mockReturnValue(throwError(() => error));
      // Act
      const result: Observable<UserDomainModel> =
        userRegisteredUseCase.execute(userRegisteredEvent);
      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBe(error);
          expect(mockUserAuthService.registerUser).toHaveBeenCalledWith(
            expect.any(UserDomainModel),
          );
          done();
        },
      });
    });
  });
});
