import { Test, TestingModule } from '@nestjs/testing';
import { ProductListener } from './product.listener';
import {
  ProductRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductUpdatedUseCase,
  SaleRegisteredUseCase,
} from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { ProductCategoryEnum, TypeNameEnum } from '@enums';
import { of } from 'rxjs';

describe('ProductListener', () => {
  let listener: ProductListener;
  let productRegisteredUseCase: ProductRegisteredUseCase;
  let productPurchaseRegisteredUseCase: ProductPurchaseRegisteredUseCase;
  let saleRegisteredUseCase: SaleRegisteredUseCase;
  let productUpdatedUseCase: ProductUpdatedUseCase;
  const mockEvent: EventDomainModel = {
    aggregateRootId: 'mockedAggregateRootId',
    eventBody: {
      id: 'mockedId',
      name: 'mockedName',
      price: 10,
      quantity: 10,
      category: ProductCategoryEnum.ConstructionHardware,
    },
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductListener,
        {
          provide: ProductRegisteredUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductPurchaseRegisteredUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: SaleRegisteredUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductUpdatedUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<ProductListener>(ProductListener);
    productRegisteredUseCase = module.get<ProductRegisteredUseCase>(
      ProductRegisteredUseCase,
    );
    productPurchaseRegisteredUseCase =
      module.get<ProductPurchaseRegisteredUseCase>(
        ProductPurchaseRegisteredUseCase,
      );
    saleRegisteredUseCase = module.get<SaleRegisteredUseCase>(
      SaleRegisteredUseCase,
    );
    productUpdatedUseCase = module.get<ProductUpdatedUseCase>(
      ProductUpdatedUseCase,
    );
  });

  it('should be defined', () => {
    // Assert
    expect(listener).toBeDefined();
  });

  describe('productPurchaseRegistered', () => {
    it('should call productPurchaseRegisteredUseCase.execute with the correct argument', (done) => {
      // Arrange
      mockEvent.typeName = TypeNameEnum.PRODUCT_PURCHASE_REGISTERED;
      jest
        .spyOn(productPurchaseRegisteredUseCase, 'execute')
        .mockReturnValue(of({} as any));

      // Act
      listener.productPurchaseRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(productPurchaseRegisteredUseCase.execute).toHaveBeenCalledWith(
          mockEvent,
        );
        done();
      });
    });
  });

  describe('productRegistered', () => {
    it('should call productRegisteredUseCase.execute with the correct argument', (done) => {
      // Arrange
      mockEvent.typeName = TypeNameEnum.PRODUCT_REGISTERED;
      jest
        .spyOn(productRegisteredUseCase, 'execute')
        .mockReturnValue(of({} as any));

      // Act
      listener.productRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(productRegisteredUseCase.execute).toHaveBeenCalledWith(
          mockEvent,
        );
        done();
      });
    });
  });

  describe('productUpdated', () => {
    it('should call productUpdatedUseCase.execute with the correct argument', (done) => {
      // Arrange
      mockEvent.typeName = TypeNameEnum.PRODUCT_UPDATED;
      jest
        .spyOn(productUpdatedUseCase, 'execute')
        .mockReturnValue(of({} as any));

      // Act
      listener.productUpdated(mockEvent);

      // Assert
      setTimeout(() => {
        expect(productUpdatedUseCase.execute).toHaveBeenCalledWith(mockEvent);
        done();
      });
    });
  });

  describe('saleRegistered', () => {
    it('should call saleRegisteredUseCase.execute with the correct argument', (done) => {
      // Arrange
      mockEvent.typeName = TypeNameEnum.SALE_REGISTERED;
      mockEvent.eventBody = {
        number: 1,
        branchId: 'branchID',
        userId: 'userID',
        products: [mockEvent.eventBody],
        total: 100,
        date: Date.now(),
      };
      jest
        .spyOn(saleRegisteredUseCase, 'execute')
        .mockReturnValue(of({} as any));

      // Act
      listener.customerSaleRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(saleRegisteredUseCase.execute).toHaveBeenCalledWith(mockEvent);
        done();
      });
    });
  });
});
