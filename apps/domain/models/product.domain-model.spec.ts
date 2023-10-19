import { ProductDomainModel } from '..';
import { ProductCategoryEnum } from '@domain/enums';
import { IErrorValueObject } from '@sofka/interfaces';

describe('ProductDomainModel', () => {
  it('should create ProductDomainModel instance', () => {
    // Arrange
    const name = 'Product Name';
    const description = 'Product Description';
    const price = 100;
    const quantity = 10;
    const category = ProductCategoryEnum.ConstructionHardware;
    const branchId = 'branch-id';
    const id = 'product-id';

    // Act
    const product = new ProductDomainModel(
      name,
      description,
      price,
      quantity,
      category,
      branchId,
      id,
    );

    // Assert
    expect(product.name).toBe(name.toUpperCase().trim());
    expect(product.description).toBe(description.trim());
    expect(product.price).toBe(price);
    expect(product.quantity).toBe(quantity);
    expect(product.category).toBe(category);
    expect(product.branchId).toBe(branchId);
    expect(product.id).toBe(id);
  });

  it('should validate value objects and return no errors', () => {
    // Arrange
    const name = 'Product Name';
    const description = 'Product Description';
    const price = 100;
    const quantity = 10;
    const category = ProductCategoryEnum.ConstructionHardware;
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const product = new ProductDomainModel(
      name,
      description,
      price,
      quantity,
      category,
      branchId,
    );

    // Act
    const errors: IErrorValueObject[] = product.getErrors();

    // Assert
    expect(errors).toEqual([]);
    expect(product.hasErrors()).toBe(false);
  });

  it('should validate value objects and return errors for empty name', () => {
    // Arrange
    const name = '';
    const description = 'Product Description';
    const price = 100;
    const quantity = 10;
    const category = ProductCategoryEnum.Electrical;
    const branchId = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';
    const id = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const product = new ProductDomainModel(
      name,
      description,
      price,
      quantity,
      category,
      branchId,
      id,
    );

    // Act
    const errors: IErrorValueObject[] = product.getErrors();

    // Assert
    expect(errors).toEqual([
      {
        field: 'ProductName',
        message: 'El nombre no puede ser vacío',
      },
    ]);
    expect(product.hasErrors()).toBe(true);
  });
});
