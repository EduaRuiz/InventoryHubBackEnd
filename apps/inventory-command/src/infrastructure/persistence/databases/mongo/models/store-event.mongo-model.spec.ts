import { StoreEventMongoModel } from './store-event.mongo-model'; // Asegúrate de importar correctamente tu modelo y su esquema
import { TypeNameEnum } from '@enums';

describe('StoreEventMongoModel', () => {
  describe('Initialization', () => {
    it('should be defined', () => {
      // Arrange
      const aggregateRootId = 'someAggregateRootId';
      const eventBody = { key: 'value' };
      const occurredOn = new Date();
      const typeName = TypeNameEnum.BRANCH_REGISTERED;

      // Act
      const event = new StoreEventMongoModel(
        aggregateRootId,
        eventBody,
        occurredOn,
        typeName,
      );

      // Assert
      expect(event).toBeDefined();
    });
  });

  describe('Properties', () => {
    it('should have correct properties', () => {
      // Arrange
      const aggregateRootId = 'someAggregateRootId';
      const eventBody = { key: 'value' };
      const occurredOn = new Date();
      const typeName = TypeNameEnum.BRANCH_REGISTERED;

      // Act
      const event = new StoreEventMongoModel(
        aggregateRootId,
        eventBody,
        occurredOn,
        typeName,
      );

      // Assert
      expect(event.aggregateRootId).toBe(aggregateRootId);
      expect(event.eventBody).toEqual(eventBody);
      expect(event.occurredOn).toBe(occurredOn);
      expect(event.typeName).toBe(typeName);
    });
  });
});
