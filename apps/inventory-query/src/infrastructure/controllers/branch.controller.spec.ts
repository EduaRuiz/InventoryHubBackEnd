import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from './branch.controller';
import { BranchService } from '../persistence';
import { UserRoleEnum } from '@enums';
import { NotFoundException } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import {
  BranchDomainModel,
  ProductDomainModel,
  SaleDomainModel,
  UserDomainModel,
} from '@domain/models';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('BranchController', () => {
  let controller: BranchController;
  let branchService: BranchService;

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
          provide: BranchService,
          useValue: {
            getBranch: jest.fn(),
            getAllBranches: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BranchController>(BranchController);
    branchService = module.get<BranchService>(BranchService);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('getBranch', () => {
    it('should return branch by id', (done) => {
      // Arrange
      const mockBranchId = 'mockedId';
      const mockBranch = {
        name: 'mockedName',
        id: mockBranchId,
        location: 'mockedLocation',
        products: [] as ProductDomainModel[],
        users: [] as UserDomainModel[],
        sales: [] as SaleDomainModel[],
      } as unknown as BranchDomainModel;

      jest
        .spyOn(branchService, 'getBranch')
        .mockReturnValue(of(mockBranch as any));

      // Act
      const result = controller.getBranch(mockBranchId);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: BranchDomainModel) => {
          expect(response).toBe(mockBranch);
          done();
        },
      });
    });

    it('should throw NotFoundException if branch is not found', (done) => {
      // Arrange
      const expectedError = new NotFoundException('Branch not found');
      const mockBranchId = 'nonExistentId';
      jest
        .spyOn(branchService, 'getBranch')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result = controller.getBranch(mockBranchId);

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

    it('should have Auth decorator with ADMIN and SUPER_ADMIN roles', () => {
      const metadata = Reflect.getMetadata('roles', controller.getBranch);
      expect(metadata).toEqual([UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN]);
    });
  });

  describe('getAllBranches', () => {
    it('should return all branches', () => {
      // Arrange
      const mockBranches = [
        {
          name: 'mockedName',
          id: 'mockedId',
          location: 'mockedLocation',
          products: [] as ProductDomainModel[],
          users: [] as UserDomainModel[],
          sales: [] as SaleDomainModel[],
        } as unknown as BranchDomainModel,
      ];
      jest
        .spyOn(branchService, 'getAllBranches')
        .mockReturnValue(of(mockBranches as any));

      // Act
      const result = controller.getAllBranches();

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: BranchDomainModel[]) => {
          expect(response).toBe(mockBranches);
        },
      });
    });

    it('should throw NotFoundException if there are no branches', (done) => {
      // Arrange
      const expectedError = new NotFoundException('Branches not found');
      jest
        .spyOn(branchService, 'getAllBranches')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result = controller.getAllBranches();

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

    it('should have Auth decorator with SUPER_ADMIN role', () => {
      const metadata = Reflect.getMetadata('roles', controller.getAllBranches);
      expect(metadata).toEqual([UserRoleEnum.SUPER_ADMIN]);
    });
  });
});
