import {
  BranchDomainModel,
  ProductDomainModel,
  SaleDomainModel,
  UserDomainModel,
} from '..';

describe('BranchDomainModel', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should create BranchDomainModel instance', () => {
    // Arrange
    const name = 'Branch Name';
    const location = 'City, Country';
    const products = [] as ProductDomainModel[];
    const users = [] as UserDomainModel[];
    const sales = [] as SaleDomainModel[];
    const id = '123';

    // Act
    const branch = new BranchDomainModel(
      name,
      location,
      products,
      users,
      sales,
      id,
    );

    // Assert
    expect(branch.name).toBe(name);
    expect(branch.location).toBe(location);
    expect(branch.products).toEqual(products);
    expect(branch.users).toEqual(users);
    expect(branch.sales).toEqual(sales);
    expect(branch.id).toBe(id);
  });

  it('should validate value objects', () => {
    // Arrange
    const name = 'Branch Name';
    const location = 'City, Country';
    const products = [] as ProductDomainModel[];
    const users = [] as UserDomainModel[];
    const sales = [] as SaleDomainModel[];

    const branch = new BranchDomainModel(
      name,
      location,
      products,
      users,
      sales,
    );

    // Act
    branch.getErrors();
    expect(branch.getErrors()).toEqual([]);
  });

  it('should validate value objects and return errors', () => {
    // Arrange
    const name = 'Branch Name';
    const location = 'City, Country';
    const products = [] as ProductDomainModel[];
    const users = [] as UserDomainModel[];
    const sales = [] as SaleDomainModel[];
    const id = '0ecdc306-6d43-49d3-a76b-afc8e8ded523';

    const branch = new BranchDomainModel(
      name,
      location,
      products,
      users,
      sales,
      id,
    );

    // Act
    branch.getErrors();
    expect(branch.getErrors()).toEqual([]);
    expect(branch.hasErrors()).toBe(false);
  });

  it('should validate value objects and it has errors', () => {
    // Arrange
    const name = '';
    const location = 'City, Country';
    const products = [] as ProductDomainModel[];
    const users = [] as UserDomainModel[];
    const sales = [] as SaleDomainModel[];

    const branch = new BranchDomainModel(
      name,
      location,
      products,
      users,
      sales,
    );

    // Act
    branch.getErrors();
    expect(branch.getErrors()).toEqual([
      {
        field: 'BranchName',
        message: 'El nombre no puede ser vacío',
      },
    ]);
    expect(branch.hasErrors()).toBe(true);
  });
});
