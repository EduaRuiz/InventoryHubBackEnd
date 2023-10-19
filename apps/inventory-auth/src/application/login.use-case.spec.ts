import { Observable, of, throwError } from 'rxjs';
import { IUserAuthDomainService, IAuthDomainService } from '@domain-services';
import { ILoginDomainCommand } from '@domain-commands';
import { UserDomainModel } from '@domain-models';
import { ILoginResponse } from 'apps/domain/interfaces';
import { UserRoleEnum } from '@domain';
import { LoginUseCase } from './login.use-case';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserAuthService: IUserAuthDomainService;
  let mockAuthDomainService: IAuthDomainService;

  beforeEach(async () => {
    mockUserAuthService = {
      login: jest.fn(),
    } as unknown as IUserAuthDomainService;
    mockAuthDomainService = {
      generateAuthResponse: jest.fn(),
    } as unknown as IAuthDomainService;
    loginUseCase = new LoginUseCase(mockUserAuthService, mockAuthDomainService);
  });

  describe('execute', () => {
    it('should call userAuthService.login and authDomainService.generateAuthResponse', (done) => {
      // Arrange
      const loginCommand: ILoginDomainCommand = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user: UserDomainModel = {
        id: '123',
        email: loginCommand.email,
        password: loginCommand.password,
        role: UserRoleEnum.ADMIN,
        branchId: '123',
        fullName: 'John Doe',
      } as unknown as UserDomainModel;

      const mockAuthResponse: ILoginResponse = {
        token: 'generatedToken',
        data: {
          userId: user.id,
          role: user.role,
          branchId: user.branchId,
        },
      };

      // Stubbing the methods
      jest.spyOn(mockUserAuthService, 'login').mockReturnValue(of(user));
      jest
        .spyOn(mockAuthDomainService, 'generateAuthResponse')
        .mockReturnValue(of(mockAuthResponse));

      // Act
      const result: Observable<ILoginResponse> =
        loginUseCase.execute(loginCommand);

      // Assert
      result.subscribe({
        next: (response: ILoginResponse) => {
          expect(response).toBe(mockAuthResponse);
          expect(mockUserAuthService.login).toHaveBeenCalledWith(
            loginCommand.email,
            loginCommand.password,
          );
          expect(
            mockAuthDomainService.generateAuthResponse,
          ).toHaveBeenCalledWith(user);
          done();
        },
      });
    });

    it('should return error if userAuthService.login throws error', (done) => {
      // Arrange
      const loginCommand: ILoginDomainCommand = {
        email: 'mockEmail',
        password: 'mockPassword',
      };
      const mockError = new Error('mockError');
      jest
        .spyOn(mockUserAuthService, 'login')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<ILoginResponse> =
        loginUseCase.execute(loginCommand);

      // Assert
      result.subscribe({
        error: (err) => {
          expect(err).toBe(mockError);
          done();
        },
      });
    });
  });
});
