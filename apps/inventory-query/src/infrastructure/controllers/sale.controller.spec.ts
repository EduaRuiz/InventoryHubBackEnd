import { Test, TestingModule } from '@nestjs/testing';
import { SaleController } from './sale.controller';
import { SaleService } from '../persistence';
import { Observable, of, throwError } from 'rxjs';
import { SaleDomainModel } from '@domain-models';
import { SaleTypeEnum, UserRoleEnum } from '@enums';
import { NotFoundException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('SaleController', () => {
  let controller: SaleController;
  let saleService: SaleService;

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
      controllers: [SaleController],
      providers: [
        {
          provide: SaleService,
          useValue: {
            getSaleById: jest.fn(),
            getAllSalesByBranchId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SaleController>(SaleController);
    saleService = module.get<SaleService>(SaleService);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('getSale', () => {
    it('should return sale by id', (done) => {
      // Arrange
      const mockSaleId = 'mockedId';
      const mockSale = {
        number: 1,
        products: [],
        date: new Date(),
        type: SaleTypeEnum.CUSTOMER_SALE,
        total: 100,
        branchId: 'mockedBranchId',
        userId: 'mockedUserId',
      } as unknown as SaleDomainModel;

      jest
        .spyOn(saleService, 'getSaleById')
        .mockReturnValue(of(mockSale as any));

      // Act
      const result = controller.getSale(mockSaleId);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: SaleDomainModel) => {
          expect(response).toBe(mockSale);
          done();
        },
      });
    });

    it('should throw NotFoundException if sale is not found', (done) => {
      // Arrange
      const expectedError = new NotFoundException('Sale not found');
      const mockSaleId = 'nonExistentId';
      jest
        .spyOn(saleService, 'getSaleById')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result = controller.getSale(mockSaleId);

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
      const authMetadata = Reflect.getMetadata('roles', controller.getSale);
      expect(authMetadata).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.SUPER_ADMIN,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });

  describe('getAllSalesByBranch', () => {
    it('should return sales by branch id', (done) => {
      // Arrange
      const mockBranchId = 'mockedBranchId';
      const mockSales = [
        {
          number: 1,
          products: [],
          date: new Date(),
          type: SaleTypeEnum.CUSTOMER_SALE,
          total: 100,
          branchId: 'mockedBranchId',
          userId: 'mockedUserId',
        } as unknown as SaleDomainModel,
      ];

      jest
        .spyOn(saleService, 'getAllSalesByBranchId')
        .mockReturnValue(of(mockSales as any));

      // Act
      const result = controller.getAllSalesByBranch(mockBranchId, 1, 100);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: SaleDomainModel[]) => {
          expect(response).toBe(mockSales);
          done();
        },
      });
    });

    it('should have Auth decorator with appropriate roles', () => {
      const authMetadata = Reflect.getMetadata(
        'roles',
        controller.getAllSalesByBranch,
      );
      expect(authMetadata).toEqual([
        UserRoleEnum.EMPLOYEE,
        UserRoleEnum.ADMIN,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });
});
