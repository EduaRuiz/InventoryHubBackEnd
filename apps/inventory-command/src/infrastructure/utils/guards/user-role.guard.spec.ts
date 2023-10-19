import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';
import { IUserAuthData } from 'apps/domain/interfaces';
import { of } from 'rxjs';
import { UserRolGuard } from './user-role.guard';

describe('UserRolGuard', () => {
  let guard: UserRolGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRolGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<UserRolGuard>(UserRolGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true for allowed role', (done) => {
    // Arrange
    const mockValidateRoles = ['admin'];
    jest.spyOn(reflector, 'get').mockReturnValue(mockValidateRoles);
    const mockUser: IUserAuthData = {
      role: 'admin',
      userId: 'userId',
      branchId: 'branchId',
    };
    const mockRequest = { user: of(mockUser) };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => jest.fn(),
    } as any;

    // Act
    guard.canActivate(mockContext as any).subscribe((result) => {
      // Assert
      expect(result).toBe(true);
      done();
    });
  });

  it('should throw UnauthorizedException for invalid role', (done) => {
    // Arrange
    const mockValidateRoles = ['admin'];
    jest.spyOn(reflector, 'get').mockReturnValue(mockValidateRoles);
    const mockUser: IUserAuthData = {
      role: 'user',
      userId: 'userId',
      branchId: 'branchId',
    };
    const mockRequest = { user: of(mockUser) };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => jest.fn(),
    } as any;

    // Act & Assert
    guard.canActivate(mockContext as any).subscribe(
      () => {},
      (error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        done();
      },
    );
  });

  it('should throw UnauthorizedException for undefined user', (done) => {
    // Arrange
    const mockValidateRoles = ['admin'];
    jest.spyOn(reflector, 'get').mockReturnValue(mockValidateRoles);
    const mockRequest = { user: of(undefined) };
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => jest.fn(),
    } as any;

    // Act & Assert
    guard.canActivate(mockContext as any).subscribe(
      () => {},
      (error) => {
        expect(error).toBeInstanceOf(UnauthorizedException);
        done();
      },
    );
  });
});
