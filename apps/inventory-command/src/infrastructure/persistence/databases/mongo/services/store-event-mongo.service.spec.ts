import { Test, TestingModule } from '@nestjs/testing';
import { StoreEventMongoModel } from '../models';
import { StoreEventMongoRepository } from '../repositories';
import { Observable, of } from 'rxjs';
import { TypeNameEnum } from '@enums';
import { EventMongoService } from './store-event-mongo.service';

describe('EventMongoService', () => {
  let eventService: EventMongoService;
  let eventRepository: StoreEventMongoRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        EventMongoService,
        {
          provide: StoreEventMongoRepository,
          useValue: {
            getLastEventByEntityId: jest.fn(),
            entityAlreadyExist: jest.fn(),
            storeEvent: jest.fn(),
            findOneById: jest.fn(),
            findAll: jest.fn(),
            generateIncrementalSaleId: jest.fn(),
          },
        },
      ],
    }).compile();

    eventService = moduleRef.get<EventMongoService>(EventMongoService);
    eventRepository = moduleRef.get<StoreEventMongoRepository>(
      StoreEventMongoRepository,
    );
  });

  describe('getLastEventByEntityId', () => {
    it('should return the last event by entity ID', (done) => {
      // Arrange
      const entityId = '1';
      const typeName: TypeNameEnum[] = [TypeNameEnum.PRODUCT_REGISTERED];
      const event: StoreEventMongoModel = {
        _id: '1',
        aggregateRootId: '1',
        eventBody: {},
        occurredOn: new Date(),
        typeName: TypeNameEnum.PRODUCT_REGISTERED,
      };

      // Act
      jest
        .spyOn(eventRepository, 'getLastEventByEntityId')
        .mockReturnValueOnce(of(event));

      const result$: Observable<StoreEventMongoModel> =
        eventService.getLastEventByEntityId(entityId, typeName);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(eventRepository.getLastEventByEntityId).toHaveBeenCalledWith(
            entityId,
            typeName,
            undefined,
          );
          expect(result).toEqual(event);
          done();
        },
      });
    });
  });

  // More test cases for other methods can be added here...

  describe('generateIncrementalSaleId', () => {
    it('should generate incremental sale ID', (done) => {
      // Arrange
      const aggregateRootId = '1';
      const typeName: TypeNameEnum[] = [TypeNameEnum.SALE_REGISTERED];
      const saleId = 1;

      // Act
      jest
        .spyOn(eventRepository, 'generateIncrementalSaleId')
        .mockReturnValueOnce(of(saleId));

      const result$: Observable<number> =
        eventService.generateIncrementalSaleId(aggregateRootId, typeName);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(
            eventRepository.generateIncrementalSaleId,
          ).toHaveBeenCalledWith(aggregateRootId, typeName);
          expect(result).toEqual(saleId);
          done();
        },
      });
    });
  });

  describe('entityAlreadyExist', () => {
    it('should return true if entity already exist', (done) => {
      // Arrange
      const key = 'id';
      const value = '1';
      const typeName: TypeNameEnum[] = [TypeNameEnum.PRODUCT_REGISTERED];
      const aggregateRootId = '1';

      // Act
      jest
        .spyOn(eventRepository, 'entityAlreadyExist')
        .mockReturnValueOnce(of(true));

      const result$: Observable<boolean> = eventService.entityAlreadyExist(
        key,
        value,
        typeName,
        aggregateRootId,
      );

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(eventRepository.entityAlreadyExist).toHaveBeenCalledWith(
            key,
            value,
            typeName,
            aggregateRootId,
          );
          expect(result).toEqual(true);
          done();
        },
      });
    });
  });

  describe('storeEvent', () => {
    it('should store event', (done) => {
      // Arrange
      const event: StoreEventMongoModel = {
        _id: '1',
        aggregateRootId: '1',
        eventBody: {},
        occurredOn: new Date(),
        typeName: TypeNameEnum.PRODUCT_REGISTERED,
      };

      // Act
      jest.spyOn(eventRepository, 'storeEvent').mockReturnValueOnce(of(event));

      const result$: Observable<StoreEventMongoModel> =
        eventService.storeEvent(event);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(eventRepository.storeEvent).toHaveBeenCalledWith(event);
          expect(result).toEqual(event);
          done();
        },
      });
    });
  });

  describe('getEvent', () => {
    it('should get event', (done) => {
      // Arrange
      const id = '1';
      const event: StoreEventMongoModel = {
        _id: '1',
        aggregateRootId: '1',
        eventBody: {},
        occurredOn: new Date(),
        typeName: TypeNameEnum.PRODUCT_REGISTERED,
      };

      // Act
      jest.spyOn(eventRepository, 'findOneById').mockReturnValueOnce(of(event));

      const result$: Observable<StoreEventMongoModel> =
        eventService.getEvent(id);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(eventRepository.findOneById).toHaveBeenCalledWith(id);
          expect(result).toEqual(event);
          done();
        },
      });
    });
  });

  describe('getAllEvents', () => {
    it('should get all events', (done) => {
      // Arrange
      const events: StoreEventMongoModel[] = [
        {
          _id: '1',
          aggregateRootId: '1',
          eventBody: {},
          occurredOn: new Date(),
          typeName: TypeNameEnum.PRODUCT_REGISTERED,
        },
        {
          _id: '2',
          aggregateRootId: '2',
          eventBody: {},
          occurredOn: new Date(),
          typeName: TypeNameEnum.PRODUCT_REGISTERED,
        },
      ];

      // Act
      jest.spyOn(eventRepository, 'findAll').mockReturnValueOnce(of(events));

      const result$: Observable<StoreEventMongoModel[]> =
        eventService.getAllEvents();

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(eventRepository.findAll).toHaveBeenCalled();
          expect(result).toEqual(events);
          done();
        },
      });
    });
  });

  describe('generateIncrementalSaleId', () => {
    it('should generate incremental sale ID', (done) => {
      // Arrange
      const aggregateRootId = '1';
      const typeName: TypeNameEnum[] = [TypeNameEnum.SALE_REGISTERED];
      const saleId = 1;

      // Act
      jest
        .spyOn(eventRepository, 'generateIncrementalSaleId')
        .mockReturnValueOnce(of(saleId));

      const result$: Observable<number> =
        eventService.generateIncrementalSaleId(aggregateRootId, typeName);

      // Assert
      result$.subscribe({
        next: (result) => {
          expect(
            eventRepository.generateIncrementalSaleId,
          ).toHaveBeenCalledWith(aggregateRootId, typeName);
          expect(result).toEqual(saleId);
          done();
        },
      });
    });
  });
});
