import { of } from 'rxjs';
import {
  EventDomainModel,
  SaleDomainModel,
  ProductDomainModel,
  UserDomainModel,
} from '@domain-models';
import { ProductCategoryEnum, TypeNameEnum, UserRoleEnum } from '@enums';
import { ValueObjectException } from '@sofka/exceptions';
import {
  IMailDomainService,
  IProductDomainService,
  ISaleDomainService,
  IUserDomainService,
} from '@domain-services';
import { SaleRegisteredUseCase } from '..';
import { SaleTypeEnum } from '../../../../../domain/enums/sale-type.enum';
import { IErrorValueObject } from '@sofka/interfaces';

describe('SaleRegisteredUseCase', () => {
  let mockSaleService: ISaleDomainService;
  let mockProductService: IProductDomainService;
  let mockUserService: IUserDomainService;
  let mockMailService: IMailDomainService;
  let saleRegisteredUseCase: SaleRegisteredUseCase;

  const saleData: SaleDomainModel = {
    id: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    products: [
      {
        name: 'NAME',
        quantity: 4,
        price: 10,
      },
    ],
    date: new Date(),
    type: SaleTypeEnum.CUSTOMER_SALE,
    number: 1,
    total: 100,
    userId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    branchId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  } as unknown as SaleDomainModel;
  const event: EventDomainModel = {
    eventBody: saleData,
    occurredOn: new Date(),
    typeName: TypeNameEnum.SALE_REGISTERED,
    aggregateRootId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  };

  const product: ProductDomainModel = {
    name: 'NAME',
    description: 'description',
    category: ProductCategoryEnum.ConstructionHardware,
    quantity: 4,
    price: 10,
    branchId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    id: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  } as unknown as ProductDomainModel;

  beforeEach(() => {
    mockSaleService = {
      createSale: jest.fn(),
    } as unknown as ISaleDomainService;

    mockProductService = {
      getProductByName: jest.fn(),
    } as unknown as IProductDomainService;

    mockUserService = {
      getAllUsersByBranchIdAndRol: jest.fn(),
    } as unknown as IUserDomainService;

    mockMailService = {
      sendEmail: jest.fn(),
    } as unknown as IMailDomainService;

    saleRegisteredUseCase = new SaleRegisteredUseCase(
      mockSaleService,
      mockProductService,
      mockUserService,
      mockMailService,
    );
  });

  describe('execute', () => {
    it('should create a new sale and notify users when products are running low', (done) => {
      // Arrange
      jest
        .spyOn(mockProductService, 'getProductByName')
        .mockReturnValueOnce(of(product));
      const usersWithAdminRole: UserDomainModel = {
        fullName: 'NAME',
        email: 'email@email.com',
        password: 'password',
        role: UserRoleEnum.ADMIN,
        branchId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
      } as unknown as UserDomainModel;
      jest
        .spyOn(mockUserService, 'getAllUsersByBranchIdAndRol')
        .mockReturnValueOnce(of([usersWithAdminRole]));

      const mockSendEmailResponse = usersWithAdminRole.email;
      jest
        .spyOn(mockMailService, 'sendEmail')
        .mockReturnValueOnce(of(mockSendEmailResponse));
      jest
        .spyOn(mockSaleService, 'createSale')
        .mockReturnValueOnce(of(saleData));

      const expectedNewSale: SaleDomainModel = saleData;

      // Act
      const result = saleRegisteredUseCase.execute(event);

      // Assert
      result.subscribe((newSale) => {
        expect(newSale).toEqual(expectedNewSale);
        expect(mockSaleService.createSale).toHaveBeenCalledWith(
          expectedNewSale,
        );
        expect(mockProductService.getProductByName).toHaveBeenCalledWith(
          product.name,
          saleData.branchId,
        );
        done();
      });
    });

    it('should handle errors and return a ValueObjectException when there are validation errors', (done) => {
      // Arrange
      const validationErrors = {} as unknown as IErrorValueObject[];
      const expectedError = new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        validationErrors,
      );
      jest
        .spyOn(mockProductService, 'getProductByName')
        .mockReturnValueOnce(of(product));
      const usersWithAdminRole: UserDomainModel = {
        fullName: 'NAME',
        email: 'email@email.com',
        password: 'password',
        role: UserRoleEnum.ADMIN,
        branchId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
      } as unknown as UserDomainModel;
      jest
        .spyOn(mockUserService, 'getAllUsersByBranchIdAndRol')
        .mockReturnValueOnce(of([usersWithAdminRole]));

      const mockSendEmailResponse = usersWithAdminRole.email;
      jest
        .spyOn(mockMailService, 'sendEmail')
        .mockReturnValueOnce(of(mockSendEmailResponse));
      jest
        .spyOn(mockSaleService, 'createSale')
        .mockReturnValueOnce(of(saleData));

      const eventFailed: EventDomainModel = {
        ...event,
        eventBody: {
          ...event.eventBody,
          branchId: '',
          userId: '',
          type: '',
          date: '',
        },
      };

      // Act
      const result = saleRegisteredUseCase.execute(eventFailed);

      // Assert
      result.subscribe({
        error: (error) => {
          expect(error).toEqual(expectedError);
          expect(mockSaleService.createSale).not.toHaveBeenCalled();
          expect(mockProductService.getProductByName).not.toHaveBeenCalled();
          expect(
            mockUserService.getAllUsersByBranchIdAndRol,
          ).not.toHaveBeenCalled();
          expect(mockMailService.sendEmail).not.toHaveBeenCalled();
          done();
        },
      });
    });

    // it('should handle errors and return a ValueObjectException when sending email fails', (done) => {
    //   // Arrange
    //   jest
    //     .spyOn(mockProductService, 'getProductByName')
    //     .mockReturnValueOnce(of(product));
    //   const usersWithAdminRole: UserDomainModel = {
    //     fullName: 'NAME',
    //     email: 'email@email.com',
    //     password: 'password',
    //     role: UserRoleEnum.ADMIN,
    //     branchId: '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    //   } as unknown as UserDomainModel;
    //   jest
    //     .spyOn(mockUserService, 'getAllUsersByBranchIdAndRol')
    //     .mockReturnValueOnce(of([usersWithAdminRole]));

    //   jest
    //     .spyOn(mockMailService, 'sendEmail')
    //     .mockReturnValueOnce(throwError(() => new Error()));
    //   jest
    //     .spyOn(mockSaleService, 'createSale')
    //     .mockReturnValueOnce(of(saleData));

    //   // Act
    //   const result = saleRegisteredUseCase.execute(event);

    //   // Assert
    //   result.subscribe({
    //     error: (error) => {
    //       expect(error).toBeInstanceOf(ValueObjectException);
    //       expect(mockSaleService.createSale).toHaveBeenCalled();
    //       expect(mockProductService.getProductByName).toHaveBeenCalled();
    //       expect(
    //         mockUserService.getAllUsersByBranchIdAndRol,
    //       ).toHaveBeenCalled();
    //       expect(mockMailService.sendEmail).toHaveBeenCalled();
    //       done();
    //     },
    //   });
    // });
  });
});
