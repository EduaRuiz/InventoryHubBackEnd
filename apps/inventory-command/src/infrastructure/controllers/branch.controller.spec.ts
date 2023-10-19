import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of, throwError } from 'rxjs';
import { BranchController } from './branch.controller';
import { BranchRegisterUseCase } from '@use-cases-command/branch';
import { NewBranchCommand } from '../utils/commands';
import { UserRoleEnum } from '@enums';
import { BranchDomainModel } from '@domain-models';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('BranchController', () => {
  let controller: BranchController;
  let branchRegisterUseCase: BranchRegisterUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secretOrPrivateKey: process.env.JWT_SECRET || 'secret',
          signOptions: {
            expiresIn: 3600,
          },
        }),
      ],
      controllers: [BranchController],
      providers: [
        {
          provide: BranchRegisterUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchController>(BranchController);
    branchRegisterUseCase = module.get<BranchRegisterUseCase>(
      BranchRegisterUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerBranch', () => {
    it('should return an Observable<BranchDomainModel>', (done) => {
      // Arrange
      const mockBranchCommand: NewBranchCommand = {
        name: 'Mock Branch Name',
        location: {
          city: 'Mock City',
          country: 'Mock Country',
        },
      };
      const mockBranchResponse: BranchDomainModel = {
        id: 'Mock Branch Id',
        name: 'Mock Branch Name',
        location: 'Mock Branch Location',
        products: [],
        users: [],
      } as unknown as BranchDomainModel;
      jest
        .spyOn(branchRegisterUseCase, 'execute')
        .mockReturnValue(of(mockBranchResponse));

      // Act
      const result: Observable<BranchDomainModel> =
        controller.registerBranch(mockBranchCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: BranchDomainModel) => {
          expect(response).toBe(mockBranchResponse);
          done();
        },
      });
    });

    it('should handle errors', (done) => {
      // Arrange
      const expectedError = new Error('Some error occurred');
      const mockBranchCommand: NewBranchCommand = {
        name: 'Mock Branch Name',
        location: {
          city: 'Mock City',
          country: 'Mock Country',
        },
      };
      jest
        .spyOn(branchRegisterUseCase, 'execute')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result: Observable<BranchDomainModel> =
        controller.registerBranch(mockBranchCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(expectedError);
          done();
        },
      });
    });

    it('should have Auth decorator with SUPER_ADMIN role', () => {
      const authDecorator = Reflect.getMetadata(
        'roles',
        controller.registerBranch,
      );
      expect(authDecorator).toEqual([UserRoleEnum.SUPER_ADMIN]);
    });
  });
});
