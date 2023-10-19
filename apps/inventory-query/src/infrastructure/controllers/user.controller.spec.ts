import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../persistence';
import { Observable, of, throwError } from 'rxjs';
import { UserRoleEnum } from '@enums';
import { NotFoundException } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
            getAllUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('getUser', () => {
    it('should return user by id', (done) => {
      // Arrange
      const mockUserId = 'mockedId';
      const mockUser = {
        id: mockUserId,
        fullName: 'mockedFullName',
        role: UserRoleEnum.ADMIN,
        branchId: 'mockedBranchId',
        email: 'mockedEmail',
        password: 'mockedPassword',
      };

      jest
        .spyOn(userService, 'getUserById')
        .mockReturnValue(of(mockUser as any));

      // Act
      const result = controller.getUser(mockUserId);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response) => {
          expect(response).toBe(mockUser);
          done();
        },
      });
    });

    it('should throw NotFoundException if user is not found', (done) => {
      // Arrange
      const expectedError = new NotFoundException('User not found');
      const mockUserId = 'nonExistentId';
      jest
        .spyOn(userService, 'getUserById')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result = controller.getUser(mockUserId);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toBe(expectedError.message);
          done();
        },
      });
    });

    it('should have Auth decorator with appropriate roles', () => {
      const authMetadata = Reflect.getMetadata('roles', controller.getUser);
      expect(authMetadata).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', (done) => {
      // Arrange
      const mockUsers = [
        {
          id: 'mockedId',
          fullName: 'mockedFullName',
          role: UserRoleEnum.ADMIN,
          branchId: 'mockedBranchId',
          email: 'mockedEmail',
          password: 'mockedPassword',
        },
      ];

      jest
        .spyOn(userService, 'getAllUsers')
        .mockReturnValue(of(mockUsers as any));

      // Act
      const result = controller.getAllUsers();

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response) => {
          expect(response).toBe(mockUsers);
          done();
        },
      });
    });

    it('should have Auth decorator with appropriate roles', () => {
      const authMetadata = Reflect.getMetadata('roles', controller.getAllUsers);
      expect(authMetadata).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });
});
