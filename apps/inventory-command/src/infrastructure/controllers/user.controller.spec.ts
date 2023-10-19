import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of, throwError } from 'rxjs';
import { UserController } from './user.controller';
import { UserDomainModel } from '@domain-models';
import { UserRegisterUseCase } from '@use-cases-command/user';
import { NewUserCommand } from '../utils/commands';
import { UserRoleEnum } from '@enums';

describe('UserController', () => {
  let controller: UserController;
  let userRegisterUseCase: UserRegisterUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserRegisterUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userRegisterUseCase = module.get<UserRegisterUseCase>(UserRegisterUseCase);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should return an Observable<UserDomainModel>', (done) => {
      // Arrange
      const mockUserCommand: NewUserCommand = {
        fullName: {
          firstName: 'Test',
          lastName: 'Test',
        },
        role: UserRoleEnum.ADMIN,
        branchId: 'test',
        email: 'test@test.com',
        password: 'Test1234',
      };
      const mockUserResponse: UserDomainModel = {
        ...mockUserCommand,
        id: 'test',
      } as unknown as UserDomainModel;
      jest
        .spyOn(userRegisterUseCase, 'execute')
        .mockReturnValue(of(mockUserResponse));

      // Act
      const result: Observable<UserDomainModel> =
        controller.registerUser(mockUserCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: UserDomainModel) => {
          expect(response).toBe(mockUserResponse);
          done();
        },
      });
    });

    it('should handle errors', (done) => {
      // Arrange
      const expectedError = new Error('Some error occurred');
      const mockUserCommand: NewUserCommand = {
        fullName: {
          firstName: 'Test',
          lastName: 'Test',
        },
        role: UserRoleEnum.ADMIN,
        branchId: 'test',
        email: 'test@test.com',
        password: 'Test1234',
      };
      jest
        .spyOn(userRegisterUseCase, 'execute')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result: Observable<UserDomainModel> =
        controller.registerUser(mockUserCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(expectedError);
          done();
        },
      });
    });

    it('should have Auth decorator with ADMIN and SUPER_ADMIN roles', () => {
      const authDecorator = Reflect.getMetadata(
        'roles',
        controller.registerUser,
      );
      expect(authDecorator).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });
});
