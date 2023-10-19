import { CustomerSaleRegisterUseCase } from './customer-sale-register.use-case';
import { SaleDomainModel } from '@domain-models';
import { EventDomainModel } from '@domain-models';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { DomainEventPublisher } from '@domain-publishers';
import { IEventDomainService } from '@domain-services';
import {
  ProductCategoryEnum,
  SaleTypeEnum,
  TypeNameEnum,
  UserRoleEnum,
} from '@enums';
import { of, throwError } from 'rxjs';
import { ValueObjectException } from '@sofka/exceptions';

describe('CustomerSaleRegisterUseCase', () => {
  let customerSaleUseCase: CustomerSaleRegisterUseCase;
  let eventServiceMock: IEventDomainService;
  let eventPublisherMock: DomainEventPublisher;
  const command = {
    branchId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    userId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    products: [
      {
        id: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
        quantity: 5,
      },
    ],
  };
  const product = {
    id: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    name: 'NAME',
    description: 'description',
    category: ProductCategoryEnum.ConstructionHardware,
    price: 100,
    quantity: 100,
    branchId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    hasErrors: jest.fn(),
    getErrors: jest.fn(),
  };
  const productClean = {
    id: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    name: 'NAME',
    description: 'description',
    category: ProductCategoryEnum.ConstructionHardware,
    price: 100,
    quantity: product.quantity - command.products[0].quantity / 2,
    branchId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
  };
  const eventProduct = {
    aggregateRootId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    eventBody: product,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_REGISTERED,
  };
  const eventProductUpdated = {
    aggregateRootId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    eventBody: product,
    occurredOn: eventProduct.occurredOn,
    typeName: TypeNameEnum.PRODUCT_UPDATED,
  };
  const userId = command.userId;
  const user = {
    id: userId,
    role: UserRoleEnum.ADMIN,
    fullName: 'fullName',
    email: 'email',
    password: 'password',
    branchId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
  };
  const sale = {
    number: 1,
    branchId: command.branchId,
    userId: command.userId,
    products: command.products,
    type: SaleTypeEnum.CUSTOMER_SALE,
    total: 500,
    date: new Date(),
  } as unknown as SaleDomainModel;

  const saleToSave = {
    id: 'b98f350d-d224-4db2-951d-9e6a1a79cd7a',
    number: 1,
    branchId: command.branchId,
    userId: command.userId,
    products: [
      { quantity: command.products[0].quantity, name: 'NAME', price: 100 },
    ],
    type: SaleTypeEnum.CUSTOMER_SALE,
    total: 500,
    date: new Date(),
  } as unknown as SaleDomainModel;
  const saleEvent = {
    aggregateRootId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
    eventBody: sale,
    occurredOn: new Date(),
    typeName: TypeNameEnum.SALE_REGISTERED,
  };

  beforeEach(() => {
    eventServiceMock = {
      getLastEventByEntityId: jest.fn(),
      generateIncrementalSaleId: jest.fn(),
      storeEvent: jest.fn(),
    } as unknown as IEventDomainService;

    eventPublisherMock = {
      response: null,
      publish: jest.fn(),
    } as unknown as DomainEventPublisher;

    customerSaleUseCase = new CustomerSaleRegisterUseCase(
      eventServiceMock,
      eventPublisherMock,
    );
  });

  describe('execute', () => {
    it('should throw ConflictException if user does not exist or is not registered', (done) => {
      // Arrange
      const expectedMessage =
        'El usuario no existe o no se encuentra registrado';
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(throwError(() => new NotFoundException()));

      // Act
      const result = customerSaleUseCase.execute(command, userId);

      //Assert
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe(expectedMessage);
          done();
        },
      });
    });

    it('should throw ConflictException if user does not belong to the selected branch', (done) => {
      // Arrange
      const expectedMessage =
        'El usuario no pertenece a la sucursal seleccionada';
      jest.spyOn(eventServiceMock, 'getLastEventByEntityId').mockReturnValue(
        of({
          aggregateRootId: 'anotherBranchId',
          eventBody: user,
          occurredOn: new Date(),
          typeName: TypeNameEnum.USER_REGISTERED,
        } as EventDomainModel),
      );

      // Act
      const result = customerSaleUseCase.execute(command, userId);

      //Assert
      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe(expectedMessage);
          done();
        },
      });
    });

    it('should return a SaleDomainModel if user exists and belongs to the selected branch', (done) => {
      // Arrange
      const expectedSale = {
        number: 1,
        branchId: command.branchId,
        userId: command.userId,
        products: command.products,
      };
      jest.spyOn(eventServiceMock, 'getLastEventByEntityId').mockReturnValue(
        of({
          aggregateRootId: command.branchId,
          eventBody: user,
          occurredOn: new Date(),
          typeName: TypeNameEnum.USER_REGISTERED,
        } as EventDomainModel),
      );
      jest
        .spyOn(customerSaleUseCase as any, 'sale')
        .mockReturnValue(of(expectedSale));

      // Act
      const result = customerSaleUseCase.execute(command, userId);

      //Assert
      result.subscribe({
        next: (sale) => {
          expect(sale).toEqual(expectedSale);
          done();
        },
      });
    });
  });

  describe('sale', () => {
    it('should throw BadRequestException if one of the products does not exist', (done) => {
      // Arrange
      const expectedMessage = 'Existen productos no registrados';
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(throwError(() => new NotFoundException()));

      // Act
      const result = (customerSaleUseCase as any).sale(command, userId);

      //Assert
      result.subscribe({
        error: (error: any) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe(expectedMessage);
          done();
        },
      });
    });

    it('should return a SaleDomainModel if all products exist', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(eventProduct as EventDomainModel));
      jest
        .spyOn(eventServiceMock, 'generateIncrementalSaleId')
        .mockReturnValue(of(1));
      jest
        .spyOn(customerSaleUseCase as any, 'storeEvents')
        .mockReturnValue(of([eventProductUpdated]));

      jest
        .spyOn(customerSaleUseCase as any, 'productsInSale')
        .mockReturnValue(of([product]));

      jest
        .spyOn(customerSaleUseCase as any, 'saleFactory')
        .mockReturnValue(of(sale as SaleDomainModel));

      jest
        .spyOn(customerSaleUseCase as any, 'saleEventFactory')
        .mockReturnValue(of(saleEvent as EventDomainModel));

      jest
        .spyOn(customerSaleUseCase as any, 'publishEvents')
        .mockReturnValue(of(null));

      jest
        .spyOn(eventServiceMock, 'storeEvent')
        .mockReturnValue(of(sale) as any);

      // Act
      const result = (customerSaleUseCase as any).sale(command, userId);

      //Assert
      result.subscribe({
        next: (sale: any) => {
          expect(sale).toEqual(sale);
          expect((customerSaleUseCase as any).storeEvents).toHaveBeenCalled();
          expect(
            (customerSaleUseCase as any).productsInSale,
          ).toHaveBeenCalled();
          expect((customerSaleUseCase as any).saleFactory).toHaveBeenCalled();
          expect(
            (customerSaleUseCase as any).saleEventFactory,
          ).toHaveBeenCalled();
          expect((customerSaleUseCase as any).publishEvents).toHaveBeenCalled();
          expect(eventServiceMock.storeEvent).toHaveBeenCalled();

          done();
        },
      });
    });
  });

  describe('getProducts', () => {
    it('should throw BadRequestException if one of the products does not exist', (done) => {
      // Arrange
      const expectedMessage = 'Existen productos no registrados';
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(throwError(() => new NotFoundException()));

      // Act
      const result = (customerSaleUseCase as any).getProducts(command);

      //Assert
      result.subscribe({
        error: (error: any) => {
          expect(error).toBeInstanceOf(ConflictException);
          expect(error.message).toBe(expectedMessage);
          done();
        },
      });
    });

    it('should return an array of ProductDomainModel', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'getLastEventByEntityId')
        .mockReturnValue(of(eventProduct as EventDomainModel));

      // Act
      const result = (customerSaleUseCase as any).getProducts(command);

      //Assert
      result.subscribe({
        next: (products: any) => {
          expect(products).toEqual([productClean]);
          done();
        },
      });
    });
  });

  describe('factoryEvents', () => {
    it('should return an array of EventDomainModel', (done) => {
      // Arrange
      const products = [product];
      const expectedEvents = [eventProductUpdated];
      jest.spyOn(product, 'hasErrors').mockReturnValue(false);

      // Act
      const result = (customerSaleUseCase as any).factoryEvents(
        of(products),
      ) as any;

      //Assert
      result.subscribe({
        next: (events: any) => {
          expect(events[0].eventBody).toEqual(expectedEvents[0].eventBody);
          done();
        },
      });
    });

    it('should throw BadRequestException if one of the products has errors', (done) => {
      // Arrange
      const products = [product];
      jest.spyOn(product, 'hasErrors').mockReturnValue(true);

      // Act
      const result = (customerSaleUseCase as any).factoryEvents(
        of(products),
      ) as any;

      //Assert
      result.subscribe({
        error: (error: any) => {
          expect(error).toBeInstanceOf(ValueObjectException);
          expect(error.message).toBe(
            'Existen algunos errores en los datos ingresados',
          );
          done();
        },
      });
    });
  });

  describe('storeEvents', () => {
    it('should return an array of EventDomainModel', (done) => {
      // Arrange
      const events = [eventProductUpdated];
      jest
        .spyOn(eventServiceMock, 'storeEvent')
        .mockReturnValue(of(eventProductUpdated));

      // Act
      const result = (customerSaleUseCase as any).storeEvents(of(events));

      //Assert
      result.subscribe({
        next: (events: any) => {
          expect(events).toEqual([eventProductUpdated]);
          done();
        },
      });
    });
  });

  describe('publishEvents', () => {
    it('should return an array of EventDomainModel', (done) => {
      // Arrange
      const events = [eventProductUpdated];
      jest
        .spyOn(eventPublisherMock, 'publish')
        .mockReturnValue(of(eventProductUpdated));

      // Act
      const result = (customerSaleUseCase as any).publishEvents(of(events));

      //Assert
      result.subscribe({
        next: (events: any) => {
          expect(events).toEqual(eventProductUpdated);
          done();
        },
      });
    });
  });

  describe('productsInSale', () => {
    it('should return an array of ProductDomainModel', (done) => {
      // Arrange
      const products = [productClean];
      const expectedProducts = [productClean];
      jest.spyOn(product, 'hasErrors').mockReturnValue(false);

      // Act
      const result = (customerSaleUseCase as any).productsInSale(
        of(products),
        command,
      ) as any;

      //Assert
      result.subscribe({
        next: (products: any) => {
          expect(products).toEqual(expectedProducts);
          done();
        },
      });
    });
  });

  describe('saleEventFactory', () => {
    it('should return an EventDomainModel', (done) => {
      // Arrange
      const expectedEvent = {
        aggregateRootId: sale.branchId,
        eventBody: sale,
        occurredOn: new Date(),
        typeName: TypeNameEnum.CUSTOMER_SALE_REGISTERED,
      };
      jest
        .spyOn(eventServiceMock, 'generateIncrementalSaleId')
        .mockReturnValue(of(1));

      // Act
      const result = (customerSaleUseCase as any).saleEventFactory(of(sale));

      //Assert
      result.subscribe({
        next: (event: any) => {
          expectedEvent.occurredOn = event.occurredOn;
          expect(event).toEqual(expectedEvent);
          done();
        },
      });
    });
  });

  describe('saleFactory', () => {
    it('should return a SaleDomainModel', (done) => {
      // Arrange
      jest
        .spyOn(eventServiceMock, 'generateIncrementalSaleId')
        .mockReturnValue(of(1));

      // Act
      const result = (customerSaleUseCase as any).saleFactory(
        of([productClean]),
        productClean.branchId,
        sale.userId,
      );

      //Assert
      result.subscribe({
        next: (nSale: any) => {
          saleToSave.date = nSale.date;
          saleToSave.id = nSale.id;
          expect(nSale).toEqual(saleToSave);
          done();
        },
      });
    });
  });
});
