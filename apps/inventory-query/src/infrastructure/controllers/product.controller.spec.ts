import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from '../persistence';
import { Observable, of, throwError } from 'rxjs';
import { ProductDomainModel } from '@domain-models';
import { ProductCategoryEnum, UserRoleEnum } from '@enums';
import { NotFoundException } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getProductById: jest.fn(),
            getAllProductsByBranchId: jest.fn(),
          },
        },
      ],
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('getProduct', () => {
    it('should return product by id', (done) => {
      // Arrange
      const mockProductId = 'mockedId';
      const mockProduct = {
        id: mockProductId,
        name: 'mockedProductName',
        description: 'mockedProductDescription',
        price: 1000,
        quantity: 100,
        branchId: 'mockedBranchId',
        category: ProductCategoryEnum.ConstructionHardware,
      } as ProductDomainModel;

      jest
        .spyOn(productService, 'getProductById')
        .mockReturnValue(of(mockProduct as any));

      // Act
      const result = controller.getProduct(mockProductId);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ProductDomainModel) => {
          expect(response).toBe(mockProduct);
          done();
        },
      });
    });

    it('should throw NotFoundException if product is not found', (done) => {
      // Arrange
      const expectedError = new NotFoundException('Product not found');
      const mockProductId = 'nonExistentId';
      jest
        .spyOn(productService, 'getProductById')
        .mockReturnValue(throwError(() => expectedError));

      // Act
      const result = controller.getProduct(mockProductId);

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

    it('should have Auth decorator with ADMIN, EMPLOYEE, and SUPER_ADMIN roles', () => {
      const metadata = Reflect.getMetadata('roles', controller.getProduct);
      expect(metadata).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.EMPLOYEE,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });

  describe('getAllProductsByBranch', () => {
    it('should return products by branch id', (done) => {
      // Arrange
      const mockBranchId = 'mockedBranchId';
      const mockProducts = [
        {
          id: 'mockedId',
          name: 'mockedProductName',
          description: 'mockedProductDescription',
          price: 1000,
          quantity: 100,
          branchId: 'mockedBranchId',
          category: ProductCategoryEnum.ConstructionHardware,
        } as ProductDomainModel,
      ];

      jest
        .spyOn(productService, 'getAllProductsByBranchId')
        .mockReturnValue(of(mockProducts as any));

      // Act
      const result = controller.getAllProductsByBranch(mockBranchId, 1, 100);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ProductDomainModel[]) => {
          expect(response).toBe(mockProducts);
          done();
        },
      });
    });

    it('should have Auth decorator with ADMIN, EMPLOYEE, and SUPER_ADMIN roles', () => {
      const metadata = Reflect.getMetadata(
        'roles',
        controller.getAllProductsByBranch,
      );
      expect(metadata).toEqual([
        UserRoleEnum.ADMIN,
        UserRoleEnum.EMPLOYEE,
        UserRoleEnum.SUPER_ADMIN,
      ]);
    });
  });
});
