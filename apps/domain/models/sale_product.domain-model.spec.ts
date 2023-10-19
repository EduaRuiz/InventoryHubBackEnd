import { SaleProductDomainModel } from '..';
import { IErrorValueObject } from '@sofka/interfaces';

describe('SaleProductDomainModel', () => {
  it('should create SaleProductDomainModel instance', () => {
    // Arrange
    const number = 1;
    const productName = 'Product Name';
    const productQuantity = 10;
    const productPrice = 100;
    const id = 'sale-product-id';

    // Act
    const saleProduct = new SaleProductDomainModel(
      number,
      productName,
      productQuantity,
      productPrice,
      id,
    );

    // Assert
    expect(saleProduct.number).toBe(number);
    expect(saleProduct.productName).toBe(productName);
    expect(saleProduct.productQuantity).toBe(productQuantity);
    expect(saleProduct.productPrice).toBe(productPrice);
    expect(saleProduct.id).toBe(id);
  });

  it('should validate value objects and return no errors', () => {
    // Arrange
    const number = 1;
    const productName = 'Product Name';
    const productQuantity = 10;
    const productPrice = 100;

    const saleProduct = new SaleProductDomainModel(
      number,
      productName,
      productQuantity,
      productPrice,
    );

    // Act
    const errors: IErrorValueObject[] = saleProduct.getErrors();

    // Assert
    expect(errors).toEqual([]);
    expect(saleProduct.hasErrors()).toBe(false);
  });

  it('should validate value objects and return errors for negative quantity', () => {
    // Arrange
    const number = 1;
    const productName = 'Product Name';
    const productQuantity = -10;
    const productPrice = 100;

    const saleProduct = new SaleProductDomainModel(
      number,
      productName,
      productQuantity,
      productPrice,
    );

    // Act
    const errors: IErrorValueObject[] = saleProduct.getErrors();

    // Assert
    expect(errors).toEqual([
      {
        field: 'SaleProduct.quantity',
        message: 'La cantidad no puede ser igual o menor a 0',
      },
    ]);
    expect(saleProduct.hasErrors()).toBe(true);
  });
});
