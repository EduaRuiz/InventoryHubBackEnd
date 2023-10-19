import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserDomainModel } from '@domain-models';
import { ILoginResponse } from 'apps/domain/interfaces';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('verifyRefreshToken', () => {
    it('should verify the refresh token and return true if valid', (done) => {
      // Arrange
      const token = 'sampleToken';
      const id = 'sampleId';
      const expectedResult = true;
      jwtService.verify = jest.fn().mockReturnValueOnce({ userId: id });

      // Act
      const observable = authService.verifyRefreshToken(token, id);

      // Assert
      observable.subscribe((result) => {
        expect(result).toBe(expectedResult);
        expect(jwtService.verify).toHaveBeenCalledWith(token);
        done();
      });
    });

    it('should handle TokenExpiredError and return true', (done) => {
      // Arrange
      const token = 'expiredToken';
      const id = 'sampleId';
      const expectedResult = true;
      jwtService.verify = jest.fn().mockImplementationOnce(() => {
        throw { name: 'TokenExpiredError' };
      });

      // Act
      const observable = authService.verifyRefreshToken(token, id);

      // Assert
      observable.subscribe((result) => {
        expect(result).toBe(expectedResult);
        expect(jwtService.verify).toHaveBeenCalledWith(token);
        done();
      });
    });

    it('should throw error if token verification fails', (done) => {
      // Arrange
      const token = 'invalidToken';
      const id = 'sampleId';
      jwtService.verify = jest.fn().mockImplementationOnce(() => {
        throw new Error('InvalidTokenError');
      });

      // Act
      const observable = authService.verifyRefreshToken(token, id);

      // Assert
      observable.subscribe(
        () => {},
        (error) => {
          expect(error.message).toBe('InvalidTokenError');
          expect(jwtService.verify).toHaveBeenCalledWith(token);
          done();
        },
      );
    });
  });

  describe('generateAuthResponse', () => {
    it('should generate an authentication response', (done) => {
      // Arrange
      const user: UserDomainModel = {
        id: 'sampleId',
        fullName: 'sampleFullName',
        branchId: 'sampleBranchId',
        role: 'sampleRole',
        email: 'sampleEmail',
        password: 'samplePassword',
      } as UserDomainModel;
      const expectedResult: ILoginResponse = {
        data: {
          branchId: user.branchId,
          role: user.role,
          userId: user.id,
        },
        token: 'sampleToken',
      };
      jwtService.sign = jest.fn().mockReturnValueOnce('sampleToken');

      // Act
      const observable = authService.generateAuthResponse(user);

      // Assert
      observable.subscribe((result) => {
        expect(result).toEqual(expectedResult);
        expect(jwtService.sign).toHaveBeenCalledWith({
          branchId: user.branchId,
          role: user.role,
          userId: user.id,
        });
        done();
      });
    });
  });
});
