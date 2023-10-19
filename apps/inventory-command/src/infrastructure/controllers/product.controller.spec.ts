import { Test, TestingModule } from '@nestjs/testing';
import { Observable, of, throwError } from 'rxjs';
import { ProductController } from './product.controller';
import {
  CustomerSaleCommand,
  NewProductCommand,
  SellerSaleCommand,
  AddProductCommand,
} from '../utils/commands';
import { ProductDomainModel, SaleDomainModel } from '@domain-models';
import { ProductDelegator } from '@use-cases-command/product';
import { ProductCategoryEnum, SaleTypeEnum } from '@enums';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('ProductController', () => {
  let controller: ProductController;
  let productDelegator: ProductDelegator;

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
      controllers: [ProductController],
      providers: [
        {
          provide: ProductDelegator,
          useValue: {
            toProductRegisterUseCase: jest.fn(),
            toProductPurchaseRegisterUseCase: jest.fn(),
            toSellerSaleUseCase: jest.fn(),
            toCustomerSaleUseCase: jest.fn(),
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productDelegator = module.get<ProductDelegator>(ProductDelegator);
  });

  it('should be defined', () => {
    // Assert
    expect(controller).toBeDefined();
  });

  describe('createProduct', () => {
    it('should return an Observable<ProductDomainModel>', (done) => {
      // Arrange
      const mockProductCommand: NewProductCommand = {
        name: 'Mock Product Name',
        description: 'Mock Product Description',
        price: 100,
        category: ProductCategoryEnum.ConstructionHardware,
        branchId: 'Mock Branch Id',
      };
      const mockProductResponse: ProductDomainModel = {
        ...mockProductCommand,
        id: 'Mock Product Id',
      } as unknown as ProductDomainModel;
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(of(mockProductResponse));

      // Act
      const result: Observable<ProductDomainModel> =
        controller.createProduct(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ProductDomainModel) => {
          expect(response).toBe(mockProductResponse);
          done();
        },
      });
    });

    it('should return an Observable<Error>', (done) => {
      // Arrange
      const mockProductCommand: NewProductCommand = {
        name: 'Mock Product Name',
        description: 'Mock Product Description',
        price: 100,
        category: ProductCategoryEnum.ConstructionHardware,
        branchId: 'Mock Branch Id',
      };
      const mockError: Error = new Error('Product already exists');
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<ProductDomainModel> =
        controller.createProduct(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(mockError);
          done();
        },
      });
    });
  });

  describe('productPurchase', () => {
    it('should return an Observable<ProductDomainModel>', (done) => {
      // Arrange
      const mockProductCommand: AddProductCommand = {
        id: 'Mock Product Id',
        quantity: 10,
      };
      const mockProductResponse: ProductDomainModel = {
        ...mockProductCommand,
        id: 'Mock Product Id',
      } as unknown as ProductDomainModel;
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(of(mockProductResponse));

      // Act
      const result: Observable<ProductDomainModel> = controller.productPurchase(
        mockProductCommand,
        mockProductCommand?.id || 'Mock Product Id',
      );

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: ProductDomainModel) => {
          expect(response).toBe(mockProductResponse);
          done();
        },
      });
    });

    it('should return an Observable<Error>', (done) => {
      // Arrange
      const mockProductCommand: AddProductCommand = {
        id: 'Mock Product Id',
        quantity: 10,
      };
      const mockError: Error = new Error('Product not found');
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<ProductDomainModel> = controller.productPurchase(
        mockProductCommand,
        mockProductCommand.id || 'Mock Product Id',
      );

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(mockError);
          done();
        },
      });
    });
  });

  describe('productSellerSale', () => {
    it('should return an Observable<SaleDomainModel>', (done) => {
      // Arrange
      const mockProductCommand: SellerSaleCommand = {
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
          },
        ],
        userId: 'Mock User Id',
        branchId: 'Mock Branch Id',
      };
      const mockProductResponse: SaleDomainModel = {
        ...mockProductCommand,
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
            name: 'Mock Product Name',
            description: 'Mock Product Description',
            price: 10,
            category: 'Mock Product Category',
          },
        ],
        number: 1,
        date: new Date(),
        type: SaleTypeEnum.SELLER_SALE,
        total: 100,
      } as unknown as SaleDomainModel;
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(of(mockProductResponse));

      // Act
      const result: Observable<SaleDomainModel> =
        controller.productSellerSale(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: SaleDomainModel) => {
          expect(response).toBe(mockProductResponse);
          done();
        },
      });
    });

    it('should return an Observable<Error>', (done) => {
      // Arrange
      const mockProductCommand: SellerSaleCommand = {
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
          },
        ],
        userId: 'Mock User Id',
        branchId: 'Mock Branch Id',
      };
      const mockError: Error = new Error('Product not found');
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<SaleDomainModel> =
        controller.productSellerSale(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(mockError);
          done();
        },
      });
    });
  });

  describe('productCustomerSale', () => {
    it('should return an Observable<SaleDomainModel>', (done) => {
      // Arrange
      const mockProductCommand: CustomerSaleCommand = {
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
          },
        ],
        userId: 'Mock User Id',
        branchId: 'Mock Branch Id',
      };
      const mockProductResponse: SaleDomainModel = {
        ...mockProductCommand,
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
            name: 'Mock Product Name',
            description: 'Mock Product Description',
            price: 10,
            category: 'Mock Product Category',
          },
        ],
        number: 1,
        date: new Date(),
        type: SaleTypeEnum.SELLER_SALE,
        total: 100,
      } as unknown as SaleDomainModel;
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(of(mockProductResponse));

      // Act
      const result: Observable<SaleDomainModel> =
        controller.productCustomerSale(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        next: (response: SaleDomainModel) => {
          expect(response).toBe(mockProductResponse);
          done();
        },
      });
    });

    it('should return an Observable<Error>', (done) => {
      // Arrange
      const mockProductCommand: CustomerSaleCommand = {
        products: [
          {
            id: 'Mock Product Id',
            quantity: 10,
          },
        ],
        userId: 'Mock User Id',
        branchId: 'Mock Branch Id',
      };
      const mockError: Error = new Error('Product not found');
      jest
        .spyOn(productDelegator, 'execute')
        .mockReturnValue(throwError(() => mockError));

      // Act
      const result: Observable<SaleDomainModel> =
        controller.productCustomerSale(mockProductCommand);

      // Assert
      expect(result).toBeInstanceOf(Observable);
      result.subscribe({
        error: (error: Error) => {
          expect(error).toBe(mockError);
          done();
        },
      });
    });
  });
});
