import { ProductDelegator } from './product-delegator';
import {
  ProductRegisterUseCase,
  ProductPurchaseRegisterUseCase,
  SellerSaleRegisterUseCase,
  CustomerSaleRegisterUseCase,
} from '.';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { of } from 'rxjs';
import { ProductDomainModel } from '@domain-models';
import { ProductCategoryEnum } from '@domain';

describe('ProductDelegator', () => {
  let productDelegator: ProductDelegator;
  let eventServiceMock: IEventDomainService;
  let eventPublisherMock: DomainEventPublisher;

  beforeEach(() => {
    eventServiceMock = {
      // mock methods as needed
    } as unknown as IEventDomainService;

    eventPublisherMock = {
      // mock methods as needed
    } as unknown as DomainEventPublisher;

    productDelegator = new ProductDelegator(
      eventServiceMock,
      eventPublisherMock,
    );
  });

  describe('toProductRegisterUseCase', () => {
    it('should set delegate as ProductRegisterUseCase instance', () => {
      // Act
      productDelegator.toProductRegisterUseCase();

      // Assert
      expect(productDelegator['delegate']).toBeInstanceOf(
        ProductRegisterUseCase,
      );
    });
  });

  describe('toProductPurchaseRegisterUseCase', () => {
    it('should set delegate as ProductPurchaseRegisterUseCase instance', () => {
      // Act
      productDelegator.toProductPurchaseRegisterUseCase();

      // Assert
      expect(productDelegator['delegate']).toBeInstanceOf(
        ProductPurchaseRegisterUseCase,
      );
    });
  });

  describe('toSellerSaleUseCase', () => {
    it('should set delegate as SellerSaleRegisterUseCase instance', () => {
      // Act
      productDelegator.toSellerSaleUseCase();

      // Assert
      expect(productDelegator['delegate']).toBeInstanceOf(
        SellerSaleRegisterUseCase,
      );
    });
  });

  describe('toCustomerSaleUseCase', () => {
    it('should set delegate as CustomerSaleRegisterUseCase instance', () => {
      // Act
      productDelegator.toCustomerSaleUseCase();

      // Assert
      expect(productDelegator['delegate']).toBeInstanceOf(
        CustomerSaleRegisterUseCase,
      );
    });
  });

  describe('execute', () => {
    it('should delegate execution to the assigned use case and return its response', (done) => {
      // Arrange
      const mockProduct: ProductDomainModel = {
        name: 'mockName',
        description: 'mockDescription',
        price: 100,
        quantity: 10,
        category: ProductCategoryEnum.ConstructionHardware,
        branchId: 'mockBranchId',
        id: 'mockId',
      } as unknown as ProductDomainModel;
      const productRegisterUseCaseMock = {
        execute: jest.fn().mockReturnValue(of(mockProduct)),
      } as unknown as ProductRegisterUseCase;

      productDelegator['delegate'] = productRegisterUseCaseMock;

      // Act & Assert
      productDelegator.execute(/* arguments */).subscribe((response) => {
        expect(response).toEqual(mockProduct);
        expect(productRegisterUseCaseMock.execute).toHaveBeenCalled();
        done();
      });
    });
  });
});
