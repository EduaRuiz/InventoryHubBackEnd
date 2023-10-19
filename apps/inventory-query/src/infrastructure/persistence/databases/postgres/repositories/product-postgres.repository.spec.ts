import { Repository } from 'typeorm';
import { ProductPostgresEntity, ProductPostgresRepository } from '..';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductCategoryEnum } from '@domain';
import { of, throwError } from 'rxjs';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ProductPostgresRepository', () => {
  let productPostgresRepository: ProductPostgresRepository;
  let productRepository: Repository<ProductPostgresEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductPostgresRepository,
        {
          provide: getRepositoryToken(ProductPostgresEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    productPostgresRepository = module.get<ProductPostgresRepository>(
      ProductPostgresRepository,
    );
    productRepository = module.get<Repository<ProductPostgresEntity>>(
      getRepositoryToken(ProductPostgresEntity),
    );
  });

  describe('findOneByName', () => {
    it('should return a product by name and branchId', (done) => {
      // Arrange
      const productName = 'Example Product';
      const productDescription = 'Example Product Description';
      const productPrice = 1000;
      const productQuantity = 10;
      const productCategory = ProductCategoryEnum.ConstructionHardware;
      const branchId = '1';
      const productEntity = new ProductPostgresEntity(
        productName,
        productDescription,
        productPrice,
        productQuantity,
        productCategory,
        branchId,
      );
      productEntity.name = productName;
      productEntity.branchId = branchId;
      jest
        .spyOn(productRepository, 'findOne')
        .mockReturnValue(Promise.resolve(productEntity));

      // Act
      const result = productPostgresRepository.findOneByName(
        productName,
        branchId,
      );

      // Assert
      result.subscribe({
        next: (product) => {
          expect(product.name).toBe(productName);
          expect(product.branchId).toBe(branchId);
          done();
        },
      });
    });

    it('should throw NotFoundException if product not found', (done) => {
      // Arrange
      const productName = 'Nonexistent Product';
      const branchId = '1';
      jest.spyOn(productRepository, 'findOne').mockReturnValue(of(null) as any);

      // Act & Assert

      const result = productPostgresRepository.findOneByName(
        productName,
        branchId,
      );

      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should throw BadRequestException if there is a PostgresError', (done) => {
      // Arrange
      const productName = 'Invalid Product';
      const branchId = '1';
      jest
        .spyOn(productRepository, 'findOne')
        .mockRejectedValue(throwError(() => new Error('Postgres Error')));

      // Act & Assert
      const result = productPostgresRepository.findOneByName(
        productName,
        branchId,
      );

      result.subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
