import { of } from 'rxjs';
import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { IProductDomainService } from '@domain-services';
import { ProductRegisteredUseCase } from '..';
import { ProductCategoryEnum, TypeNameEnum } from '@domain';

describe('ProductRegisteredUseCase', () => {
  let mockProductService: IProductDomainService;
  let productRegisteredUseCase: ProductRegisteredUseCase;
  const newProduct = new ProductDomainModel(
    'NAME',
    'description',
    10,
    5,
    ProductCategoryEnum.ConstructionHardware,
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  );
  const event: EventDomainModel = {
    eventBody: newProduct,
    aggregateRootId: newProduct.id,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_REGISTERED,
  };

  beforeEach(() => {
    mockProductService = {
      createProduct: jest.fn(),
    } as unknown as IProductDomainService;

    // Crea una nueva instancia del caso de uso con el mock del servicio
    productRegisteredUseCase = new ProductRegisteredUseCase(mockProductService);
  });

  describe('execute', () => {
    it('should return an observable with the product registered', (done) => {
      // Arrange
      jest
        .spyOn(mockProductService, 'createProduct')
        .mockReturnValueOnce(of(newProduct));

      // Act
      const result = productRegisteredUseCase.execute(event);
      result.subscribe({
        next: (product) => {
          // Assert
          expect(product).toEqual(newProduct);
          expect(mockProductService.createProduct).toHaveBeenCalledWith(
            newProduct,
          );
          done();
        },
        error: () => {
          done.fail('El observable no debería emitir un error');
        },
      });
    });
  });

  it('should return an observable with an error when the product is not registered', (done) => {
    // Arrange
    const productWithErrors = new ProductDomainModel(
      '',
      'description',
      10,
      5,
      ProductCategoryEnum.ConstructionHardware,
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    );
    const eventWithErrors: EventDomainModel = {
      eventBody: productWithErrors,
      aggregateRootId: productWithErrors.id,
      occurredOn: new Date(),
      typeName: TypeNameEnum.PRODUCT_REGISTERED,
    };
    jest
      .spyOn(mockProductService, 'createProduct')
      .mockReturnValueOnce(of(newProduct));

    // Act
    const result = productRegisteredUseCase.execute(eventWithErrors);

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
