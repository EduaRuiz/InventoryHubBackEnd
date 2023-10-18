import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthController } from './auth.controller';
import { LoginCommand, TokenCommand } from '../utils/commands';
import { LoginUseCase } from '../../application';
import { RefreshTokenUseCase } from '@use-cases-auth';
import { ILoginResponse } from '@domain/interfaces';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;
  let refreshTokenUseCase: RefreshTokenUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: RefreshTokenUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    refreshTokenUseCase = module.get<RefreshTokenUseCase>(RefreshTokenUseCase);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('loginUser', () => {
    it('should return an Observable<ILoginResponse>', (done) => {
      // Arrange
      const mockLoginCommand: LoginCommand = {
        email: 'mockedEmail',
        password: 'mockedPassword',
      };
      const mockLoginResponse: ILoginResponse = {
        token: 'mockedToken',
        data: {
          userId: 'mockedId',
          role: 'mockedRole',
          branchId: 'mockedName',
        },
      };
      jest
        .spyOn(loginUseCase, 'execute')
        .mockReturnValue(of(mockLoginResponse));

      // Act
      const result: Observable<ILoginResponse> =
        controller.loginUser(mockLoginCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ILoginResponse) => {
          expect(response).toBe(mockLoginResponse);
          done();
        },
      });
    });
  });

  describe('loginUser', () => {
    it('should return an error', (done) => {
      // Arrange
      const expected = new Error('User does not exist');
      const mockLoginCommand: LoginCommand = {
        email: 'mockedEmail',
        password: 'mockedPassword',
      };
      jest
        .spyOn(loginUseCase, 'execute')
        .mockReturnValue(throwError(() => expected));

      // Act
      const result: Observable<ILoginResponse> =
        controller.loginUser(mockLoginCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(expected);
          done();
        },
      });
    });
  });

  describe('refreshToken', () => {
    it('should return an Observable<ILoginResponse>', (done) => {
      // Arrange
      const mockTokenCommand: TokenCommand = {
        id: 'mockedId',
        token: 'mockedToken',
      };
      const mockLoginResponse: ILoginResponse = {
        token: 'mockedToken',
        data: {
          userId: 'mockedId',
          role: 'mockedRole',
          branchId: 'mockedName',
        },
      };
      jest
        .spyOn(refreshTokenUseCase, 'execute')
        .mockReturnValue(of(mockLoginResponse.token));

      // Act
      const result: Observable<{ token: string }> =
        controller.refreshToken(mockTokenCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ILoginResponse) => {
          expect(response).toEqual({ token: mockLoginResponse.token });
          done();
        },
      });
    });
  });
});
