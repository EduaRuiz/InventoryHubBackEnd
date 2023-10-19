import { ProductRegisterUseCase } from './product-register.use-case';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { INewProductDomainCommand } from '@domain-commands';
import { ProductDomainModel, EventDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { of } from 'rxjs';
import { ProductCategoryEnum, TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

describe('ProductRegisterUseCase', () => {
  let productUseCase: ProductRegisterUseCase;
  let eventServiceMock: IEventDomainService;
  let eventPublisherMock: DomainEventPublisher;

  const productId = '2897ddc8-4ec7-420c-a8cc-38530adc8d23';
  const branchId = '2897ddc8-4ec7-420c-a8cc-38530adc8d23';
  const productName = 'PRODUCT NAME';
  const command = {
    name: productName,
    description: 'product description',
    price: 1000,
    category: ProductCategoryEnum.ConstructionHardware,
    branchId: branchId,
  } as INewProductDomainCommand;
  const productTo: ProductDomainModel = {
    id: productId,
    name: productName,
    description: 'product description',
    price: 1000,
    quantity: 0,
    branchId: branchId,
    category: ProductCategoryEnum.ConstructionHardware,
  } as unknown as ProductDomainModel;
  const event: EventDomainModel = {
    aggregateRootId: branchId,
    eventBody: productTo,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
  };

  beforeEach(() => {
    eventServiceMock = {
      entityAlreadyExist: jest.fn(),
      getLastEventByEntityId: jest.fn(),
      storeEvent: jest.fn(),
    } as unknown as IEventDomainService;

    eventPublisherMock = {
      response: null,
      publish: jest.fn(),
    } as unknown as DomainEventPublisher;

    productUseCase = new ProductRegisterUseCase(
      eventServiceMock,
      eventPublisherMock,
    );
  });

  describe('execute', () => {
    it('should register a product purchase and return the updated product', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(event));
      jest.spyOn(eventServiceMock, 'storeEvent').mockReturnValue(of(event));

      // Act
      const result = productUseCase.execute(command);

      // Assert
      result.subscribe({
        next: (response) => {
          productTo.id = response.id;
          expect(response).toEqual(productTo);
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
      const invalidCommand = {
        name: productName,
        price: 1000,
        category: ProductCategoryEnum.ConstructionHardware,
        branchId: branchId,
      } as INewProductDomainCommand;
      jest
        .spyOn(eventServiceMock, 'entityAlreadyExist')
        .mockReturnValue(of(true));
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(invalidEvent));

      // Act
      const result = productUseCase.execute(invalidCommand);

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

    it('should throw ConflictException if the product name already exist in the branch', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'entityAlreadyExist')
        .mockReturnValue(of(true));

      // Act
      const result = productUseCase.execute(command);

      // Assert
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(eventServiceMock.storeEvent).not.toHaveBeenCalled();
          expect(eventPublisherMock.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should handle error and throw an error if event service throws an error', (done) => {
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
        .spyOn(eventServiceMock, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(invalidEvent));

      // Act & Assert
      const result = productUseCase.execute(command);

      //Assert
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(eventServiceMock.storeEvent).toHaveBeenCalled();
          expect(eventPublisherMock.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
