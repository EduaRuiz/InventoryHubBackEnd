import { SaleDomainModel } from '..';
import { SaleTypeEnum } from '@domain/enums';
import { SaleProductType } from '@domain/types';
import { IErrorValueObject } from '@sofka/interfaces';

describe('SaleDomainModel', () => {
  it('should create SaleDomainModel instance', () => {
    // Arrange
    const number = 1;
    const products: SaleProductType[] = [
      { name: 'Product 1', quantity: 2, price: 50 },
      { name: 'Product 2', quantity: 3, price: 30 },
    ];
    const date = new Date();
    const type = SaleTypeEnum.CUSTOMER_SALE;
    const total = 260;
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';
    const userId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';
    const id = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    // Act
    const sale = new SaleDomainModel(
      number,
      products,
      date,
      type,
      total,
      branchId,
      userId,
      id,
    );

    // Assert
    expect(sale.number).toBe(number);
    expect(sale.products).toEqual(products);
    expect(sale.date).toBe(date);
    expect(sale.type).toBe(type);
    expect(sale.total).toBe(total);
    expect(sale.branchId).toBe(branchId);
    expect(sale.userId).toBe(userId);
    expect(sale.id).toBe(id);
  });

  it('should validate value objects and return no errors', () => {
    // Arrange
    const number = 1;
    const products: SaleProductType[] = [
      { name: 'Product 1', quantity: 2, price: 50 },
      { name: 'Product 2', quantity: 3, price: 30 },
    ];
    const date = new Date();
    const type = SaleTypeEnum.CUSTOMER_SALE;
    const total = 260;
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';
    const userId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const sale = new SaleDomainModel(
      number,
      products,
      date,
      type,
      total,
      branchId,
      userId,
    );

    // Act
    const errors: IErrorValueObject[] = sale.getErrors();

    // Assert
    expect(errors).toEqual([]);
    expect(sale.hasErrors()).toBe(false);
  });

  it('should validate value objects and return errors for negative total', () => {
    // Arrange
    const number = 1;
    const products: SaleProductType[] = [
      { name: 'Product 1', quantity: 2, price: 50 },
      { name: 'Product 2', quantity: 3, price: 30 },
    ];
    const date = new Date();
    const type = SaleTypeEnum.CUSTOMER_SALE;
    const total = -260;
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';
    const userId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const sale = new SaleDomainModel(
      number,
      products,
      date,
      type,
      total,
      branchId,
      userId,
    );

    // Act
    const errors: IErrorValueObject[] = sale.getErrors();

    // Assert
    expect(errors).toEqual([
      {
        field: 'SaleTotal',
        message: 'El total no puede ser igual o menor a 0',
      },
    ]);
    expect(sale.hasErrors()).toBe(true);
  });
});
