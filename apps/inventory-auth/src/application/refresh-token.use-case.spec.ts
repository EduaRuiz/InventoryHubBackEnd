import { RefreshTokenUseCase } from './refresh-token.use-case';
import { IUserAuthDomainService, IAuthDomainService } from '@domain-services';
import { ITokenCommand } from '@domain-commands';
import { UserDomainModel } from '@domain-models';
import { ILoginResponse } from 'apps/domain/interfaces';
import { Observable, throwError, of } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let mockUserAuthService: IUserAuthDomainService;
  let mockAuthDomainService: IAuthDomainService;

  beforeEach(() => {
    mockUserAuthService = {
      findById: jest.fn(),
    } as unknown as IUserAuthDomainService;

    mockAuthDomainService = {
      verifyRefreshToken: jest.fn(),
      generateAuthResponse: jest.fn(),
    } as unknown as IAuthDomainService;

    refreshTokenUseCase = new RefreshTokenUseCase(
      mockUserAuthService,
      mockAuthDomainService,
    );
  });

  describe('execute', () => {
    it('should return a valid token when given a valid refresh token and user ID', (done) => {
      // Arrange
      const tokenCommand: ITokenCommand = {
        token: 'validRefreshToken',
        id: 'userId',
      };

      const user: UserDomainModel = {
        id: '123',
        email: 'mockEmail',
        password: 'mockPassword',
        role: 'mockRole',
        branchId: 'mockBranchId',
        fullName: 'mockFullName',
      } as UserDomainModel;

      const mockAuthResponse: ILoginResponse = {
        token: 'newToken',
        data: {
          userId: user.id,
          role: user.role,
          branchId: user.branchId,
        },
      };
      jest
        .spyOn(mockAuthDomainService, 'verifyRefreshToken')
        .mockReturnValue(of(true));
      jest.spyOn(mockUserAuthService, 'findById').mockReturnValue(of(user));
      jest
        .spyOn(mockAuthDomainService, 'generateAuthResponse')
        .mockReturnValue(of(mockAuthResponse));

      // Act
      const result: Observable<string> =
        refreshTokenUseCase.execute(tokenCommand);

      // Assert
      result.subscribe({
        next: (token: string) => {
          expect(token).toBe('newToken');
          expect(mockAuthDomainService.verifyRefreshToken).toHaveBeenCalledWith(
            tokenCommand.token,
            tokenCommand.id,
          );
          expect(mockUserAuthService.findById).toHaveBeenCalledWith(
            tokenCommand.id,
          );
          expect(
            mockAuthDomainService.generateAuthResponse,
          ).toHaveBeenCalledWith(user);
          done();
        },
        error: (err: any) => {
          done.fail(err);
        },
      });
    });

    it('should throw BadRequestException when given an invalid refresh token', (done) => {
      // Arrange
      const tokenCommand: ITokenCommand = {
        token: 'invalidRefreshToken',
        id: 'userId',
      };
      jest
        .spyOn(mockAuthDomainService, 'verifyRefreshToken')
        .mockReturnValue(of(false));

      // Act
      const result: Observable<string> =
        refreshTokenUseCase.execute(tokenCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Expected error but got result instead');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toBe('Token inválido');
          done();
        },
      });
    });

    it('should throw BadRequestException when given an invalid user ID', (done) => {
      // Arrange
      const tokenCommand: ITokenCommand = {
        token: 'invalidRefreshToken',
        id: 'userId',
      };
      const mockError = new Error('mockError');
      jest
        .spyOn(mockAuthDomainService, 'verifyRefreshToken')
        .mockReturnValue(of(true));
      jest
        .spyOn(mockUserAuthService, 'findById')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<string> =
        refreshTokenUseCase.execute(tokenCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Expected error but got result instead');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(BadRequestException);
          expect(err.message).toBe('Token inválido');
          done();
        },
      });
    });
  });
});
