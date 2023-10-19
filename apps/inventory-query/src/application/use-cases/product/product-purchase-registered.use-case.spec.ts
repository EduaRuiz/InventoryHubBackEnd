import { of } from 'rxjs';
import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { IProductDomainService } from '@domain-services';
import { ProductPurchaseRegisteredUseCase } from '..';
import { ProductCategoryEnum, TypeNameEnum } from '@domain';

describe('ProductPurchaseRegisteredUseCase', () => {
  let mockProductService: IProductDomainService;
  let productPurchaseRegisteredUseCase: ProductPurchaseRegisteredUseCase;
  const newProductPurchase = new ProductDomainModel(
    'NAME',
    'description',
    10,
    5,
    ProductCategoryEnum.ConstructionHardware,
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  );
  const event: EventDomainModel = {
    eventBody: newProductPurchase,
    aggregateRootId: newProductPurchase.id,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
  };

  beforeEach(() => {
    mockProductService = {
      createProduct: jest.fn(),
    } as unknown as IProductDomainService;

    // Crea una nueva instancia del caso de uso con el mock del servicio
    productPurchaseRegisteredUseCase = new ProductPurchaseRegisteredUseCase(
      mockProductService,
    );
  });

  describe('execute', () => {
    it('should return an observable with the productPurchase registered', (done) => {
      // Arrange
      jest
        .spyOn(mockProductService, 'createProduct')
        .mockReturnValueOnce(of(newProductPurchase));

      // Act
      const result = productPurchaseRegisteredUseCase.execute(event);
      result.subscribe({
        next: (productPurchase) => {
          // Assert
          expect(productPurchase).toEqual(newProductPurchase);
          expect(mockProductService.createProduct).toHaveBeenCalledWith(
            newProductPurchase,
          );
          done();
        },
        error: () => {
          done.fail('El observable no debería emitir un error');
        },
      });
    });
  });

  it('should return an observable with an error when the productPurchase is not registered', (done) => {
    // Arrange
    const productPurchaseWithErrors = new ProductDomainModel(
      '',
      'description',
      10,
      5,
      ProductCategoryEnum.ConstructionHardware,
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    );
    const eventWithErrors: EventDomainModel = {
      eventBody: productPurchaseWithErrors,
      aggregateRootId: productPurchaseWithErrors.id,
      occurredOn: new Date(),
      typeName: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
    };
    jest
      .spyOn(mockProductService, 'createProduct')
      .mockReturnValueOnce(of(newProductPurchase));

    // Act
    const result = productPurchaseRegisteredUseCase.execute(eventWithErrors);

    // Assert
    result.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(ValueObjectException);
        expect(error.message).toEqual(
          'Existen algunos errores en los datos ingresados',
        );
        expect(mockProductService.createProduct).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
