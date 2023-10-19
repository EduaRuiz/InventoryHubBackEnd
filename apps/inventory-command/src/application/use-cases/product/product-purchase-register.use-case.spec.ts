import { ProductPurchaseRegisterUseCase } from './product-purchase-register.use-case';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { IAddProductDomainCommand } from '@domain-commands';
import { ProductDomainModel, EventDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { of, throwError } from 'rxjs';
import { ProductCategoryEnum, TypeNameEnum } from '@enums';

describe('ProductPurchaseRegisterUseCase', () => {
  let productPurchaseUseCase: ProductPurchaseRegisterUseCase;
  let eventServiceMock: IEventDomainService;
  let eventPublisherMock: DomainEventPublisher;

  const productId = '2897ddc8-4ec7-420c-a8cc-38530adc8d23';
  const branchId = '2897ddc8-4ec7-420c-a8cc-38530adc8d23';
  const command = {
    id: productId,
    quantity: 5,
  } as IAddProductDomainCommand;
  const productToPurchase: ProductDomainModel = {
    id: productId,
    name: 'product name',
    description: 'product description',
    price: 1000,
    quantity: 10,
    branchId: branchId,
    category: ProductCategoryEnum.ConstructionHardware,
  } as unknown as ProductDomainModel;
  const event: EventDomainModel = {
    aggregateRootId: branchId,
    eventBody: productToPurchase,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
  };

  beforeEach(() => {
    eventServiceMock = {
      getLastEventByEntityId: jest.fn(),
      storeEvent: jest.fn(),
    } as unknown as IEventDomainService;

    eventPublisherMock = {
      response: null,
      publish: jest.fn(),
    } as unknown as DomainEventPublisher;

    productPurchaseUseCase = new ProductPurchaseRegisterUseCase(
      eventServiceMock,
      eventPublisherMock,
    );
  });

  describe('execute', () => {
    it('should register a product purchase and return the updated product', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(event));
      jest.spyOn(eventServiceMock, 'storeEvent').mockReturnValue(of(event));

      // Act
      const result = productPurchaseUseCase.execute(
        command,
        command?.id || productId,
      );

      // Assert
      result.subscribe({
        next: (response) => {
          expect(response).toEqual(productToPurchase);
          expect(eventServiceMock.storeEvent).toHaveBeenCalled();
          expect(eventPublisherMock.publish).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw ValueObjectException if the new product has errors', (done) => {
      // Arrange
      const invalidEvent = {
        aggregateRootId: branchId,
        eventBody: {
          name: 'product name',
        },
        occurredOn: new Date(),
        typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
      };
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(invalidEvent));

      // Act
      const result = productPurchaseUseCase.execute(command, productId);

      // Assert
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ValueObjectException);
          expect(eventServiceMock.storeEvent).not.toHaveBeenCalled();
          expect(eventPublisherMock.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle error and throw an error if event service throws an error', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(throwError(() => 'Error from event service'));

      // Act & Assert
      const result = productPurchaseUseCase.execute(command, productId);

      //Assert
      result.subscribe({
        error: (error) => {
          expect(error).toEqual('Error from event service');
          expect(eventServiceMock.storeEvent).not.toHaveBeenCalled();
          expect(eventPublisherMock.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
