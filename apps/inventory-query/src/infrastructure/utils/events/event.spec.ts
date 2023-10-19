import { TypeNameEnum } from '@domain/enums';
import { Event } from './event';
import { EventDomainModel } from '@domain-models';

describe('Event', () => {
  let event: Event;
  const aggregateRootId = 'sampleId';
  const eventBody = {};
  const occurredOn = new Date();
  const typeName = TypeNameEnum.BRANCH_REGISTERED;

  beforeEach(() => {
    event = new Event(aggregateRootId, eventBody, occurredOn, typeName);
  });

  it('should be defined and be an instance of EventDomainModel', () => {
    // Assert
    expect(event).toBeDefined();
    expect(event instanceof EventDomainModel).toBeTruthy();
  });
});
