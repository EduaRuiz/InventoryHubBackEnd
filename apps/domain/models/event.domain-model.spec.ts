import { EventDomainModel } from '..';
import { TypeNameEnum } from '@enums';

describe('EventDomainModel', () => {
  it('should create EventDomainModel instance', () => {
    // Arrange
    const aggregateRootId = '123';
    const eventBody = { key: 'value' };
    const occurredOn = new Date();
    const typeName = TypeNameEnum.BRANCH_REGISTERED;

    // Act
    const event = new EventDomainModel(
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

  it('should have correct properties', () => {
    // Arrange
    const aggregateRootId = '123';
    const eventBody = { key: 'value' };
    const occurredOn = new Date();
    const typeName = TypeNameEnum.BRANCH_REGISTERED;

    // Act
    const event = new EventDomainModel(
      aggregateRootId,
      eventBody,
      occurredOn,
      typeName,
    );

    // Assert
    expect(event).toHaveProperty('aggregateRootId', aggregateRootId);
    expect(event).toHaveProperty('eventBody', eventBody);
    expect(event).toHaveProperty('occurredOn', occurredOn);
    expect(event).toHaveProperty('typeName', typeName);
  });
});
