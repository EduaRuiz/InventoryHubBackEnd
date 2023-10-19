import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { StoreEventMongoModel } from '../models';
import { TypeNameEnum } from '@enums';
import { of, throwError } from 'rxjs';
import { StoreEventMongoRepository } from './store-event-mongo.repository';

jest.mock('mongoose');

describe('StoreEventMongoRepository', () => {
  let repository: StoreEventMongoRepository;
  let model: Model<StoreEventMongoModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreEventMongoRepository,
        {
          provide: getModelToken(StoreEventMongoModel.name),
          useValue: {
            findOne: jest.fn(() => ({
              sort: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            })),
            create: jest.fn(),
            find: jest.fn(() => ({
              sort: jest.fn().mockReturnThis(),
              exec: jest.fn(),
            })),
            findById: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<StoreEventMongoRepository>(
      StoreEventMongoRepository,
    );
    model = module.get<Model<StoreEventMongoModel>>(
      getModelToken(StoreEventMongoModel.name),
    );
  });

  it('should be defined', () => {
    // Assert
    expect(repository).toBeDefined();
  });

  describe('getLastEventByEntityId', () => {
    it('should return the last event by entityId when event is found', (done) => {
      // Arrange
      const entityId = '123';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];
      const storedEvent = {} as unknown as StoreEventMongoModel;
      const mockExec = jest.fn().mockResolvedValueOnce(storedEvent);
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.getLastEventByEntityId(
        entityId,
        typeNameArray,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvent);
          expect(model.findOne).toHaveBeenCalledWith({
            'eventBody.id': entityId,
            typeName: { $in: typeNameArray },
          });
          expect(mockExec).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw a NotFoundException when no event is found', (done) => {
      // Arrange
      const entityId = '123';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.getLastEventByEntityId(
        entityId,
        typeNameArray,
      );

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should throw a BadRequestException when an error occurs', (done) => {
      // Arrange
      const entityId = '123';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];
      const mockExec = jest.fn().mockRejectedValueOnce(new Error());
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.getLastEventByEntityId(
        entityId,
        typeNameArray,
      );

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('entityAlreadyExist', () => {
    it('should return true when entity already exists', (done) => {
      // Arrange
      const key = 'email';
      const value = 'test@example.com';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];
      const aggregateRootId = '123';
      const existingEvent = {} as unknown as StoreEventMongoModel;
      const mockExec = jest.fn().mockResolvedValueOnce(existingEvent);
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.entityAlreadyExist(
        key,
        value,
        typeNameArray,
        aggregateRootId,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(true);
          expect(model.findOne).toHaveBeenCalledWith({
            'eventBody.email': value,
            typeName: { $in: typeNameArray },
            aggregateRootId: { $in: [aggregateRootId, 'NULL'] },
          });
          done();
        },
      });
    });

    it('should return false when entity does not exist', (done) => {
      // Arrange
      const key = 'email';
      const value = 'nonexistent@example.com';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];
      const aggregateRootId = '123';
      const mockExec = jest.fn().mockResolvedValueOnce(null);
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.entityAlreadyExist(
        key,
        value,
        typeNameArray,
        aggregateRootId,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(false);
          expect(model.findOne).toHaveBeenCalledWith({
            'eventBody.email': value,
            typeName: { $in: typeNameArray },
            aggregateRootId: { $in: [aggregateRootId, 'NULL'] },
          });
          done();
        },
      });
    });

    it('should throw a BadRequestException when an error occurs', (done) => {
      // Arrange
      const key = 'email';
      const value = 'mockEmail';
      const typeNameArray = [
        TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
        TypeNameEnum.PRODUCT_REGISTERED,
      ];

      const mockExec = jest.fn().mockRejectedValueOnce(new Error());
      jest.spyOn(model, 'findOne').mockReturnValueOnce({
        sort: jest.fn().mockReturnValueOnce({
          exec: mockExec,
        }),
      } as any);

      // Act
      const result$ = repository.entityAlreadyExist(key, value, typeNameArray);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('storeEventUpdate', () => {
    it('should return the stored event', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      jest.spyOn(model, 'create').mockResolvedValueOnce(storedEvent as any);

      // Act
      const result$ = repository.storeEventUpdate(storedEvent);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvent);
          expect(model.create).toHaveBeenCalledWith(storedEvent);
          done();
        },
      });
    });

    it('should throw a ConflictException when an error occurs', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      jest.spyOn(model, 'create').mockRejectedValueOnce(new Error());

      // Act
      const result$ = repository.storeEventUpdate(storedEvent);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ConflictException);
          done();
        },
      });
    });
  });

  describe('storeEvent', () => {
    it('should return the stored event', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      const mockExec = jest.fn().mockResolvedValueOnce(storedEvent);
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);
      jest.spyOn(model, 'create').mockResolvedValueOnce(storedEvent as any);

      // Act
      const result$ = repository.storeEvent(storedEvent);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvent);
          expect(model.create).toHaveBeenCalledWith(storedEvent);
          done();
        },
      });
    });

    it('should throw a ConflictException when an error occurs', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      const mockExec = jest.fn().mockResolvedValueOnce(new Error());
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);
      jest.spyOn(model, 'create').mockRejectedValueOnce(new Error());

      // Act
      const result$ = repository.storeEvent(storedEvent);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ConflictException);
          done();
        },
      });
    });

    it('should throw a ConflictException when an event already exists', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      const mockExec = jest.fn().mockResolvedValueOnce([storedEvent]);
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);

      // Act
      const result$ = repository.storeEvent(storedEvent);

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(ConflictException);
          done();
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all stored events', (done) => {
      // Arrange
      const storedEvents = [{} as unknown as StoreEventMongoModel];
      const mockExec = jest.fn().mockResolvedValueOnce(storedEvents);
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);

      // Act
      const result$ = repository.findAll();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvents);
          expect(model.find).toHaveBeenCalledWith(
            {},
            {},
            { populate: 'storedEvent' },
          );
          expect(mockExec).toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('findOneById', () => {
    it('should return the stored event', (done) => {
      // Arrange
      const storedEvent = {} as unknown as StoreEventMongoModel;
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(storedEvent) as any);

      // Act
      const result$ = repository.findOneById('123');

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvent);
          expect(model.findById).toHaveBeenCalledWith({ _id: '123' }, {});
          done();
        },
      });
    });

    it('should throw a NotFoundException when no event is found', (done) => {
      // Arrange
      jest.spyOn(model, 'findById').mockReturnValueOnce(of(null) as any);

      // Act
      const result$ = repository.findOneById('123');

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(NotFoundException);
          done();
        },
      });
    });

    it('should throw a BadRequestException when an error occurs', (done) => {
      // Arrange
      jest
        .spyOn(model, 'findById')
        .mockReturnValueOnce(throwError(() => new Error()) as any);

      // Act
      const result$ = repository.findOneById('123');

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('findByEventBody', () => {
    it('should return all stored events', (done) => {
      // Arrange
      const storedEvents = [{} as unknown as StoreEventMongoModel];
      const mockExec = jest.fn().mockResolvedValueOnce(storedEvents);
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);

      // Act
      const result$ = repository.findByEventBody('test', 'test');

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(storedEvents);
          expect(mockExec).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw a BadRequestException when an error occurs', (done) => {
      // Arrange
      const mockExec = jest.fn().mockRejectedValueOnce(new Error());
      jest.spyOn(model, 'find').mockReturnValueOnce({
        exec: mockExec,
      } as any);

      // Act
      const result$ = repository.findByEventBody('test', 'test', 'rootId');

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });

  describe('generateIncrementalSaleId', () => {
    it('should return the next incremental sale id', (done) => {
      // Arrange
      const aggregateRootId = '123';
      const typeNames = [TypeNameEnum.PRODUCT_PURCHASE_REGISTERED];
      const countDocuments = 1;
      jest
        .spyOn(model, 'countDocuments')
        .mockReturnValueOnce(of(countDocuments) as any);

      // Act
      const result$ = repository.generateIncrementalSaleId(
        aggregateRootId,
        typeNames,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(result).toBe(countDocuments + 1);
          expect(model.countDocuments).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw a BadRequestException when an error occurs', (done) => {
      // Arrange
      const aggregateRootId = '123';
      const typeNames = [TypeNameEnum.PRODUCT_PURCHASE_REGISTERED];
      jest
        .spyOn(model, 'countDocuments')
        .mockReturnValueOnce(throwError(() => new Error()) as any);

      // Act
      const result$ = repository.generateIncrementalSaleId(
        aggregateRootId,
        typeNames,
      );

      // Assert
      result$.subscribe({
        error: (err) => {
          expect(err).toBeInstanceOf(BadRequestException);
          done();
        },
      });
    });
  });
});
