import { Observable, of } from 'rxjs';
import { EventPublisher } from '..';

describe('EventPublisher', () => {
  let mockAmqpConnection: any;
  let eventPublisher: EventPublisher;

  beforeEach(() => {
    mockAmqpConnection = {
      publish: jest.fn(),
    } as unknown as any;

    eventPublisher = new EventPublisher(mockAmqpConnection);
  });

  describe('publish', () => {
    it('should publish an event to the specified exchange with correct parameters', (done) => {
      // Arrange
      const eventEntity = {
        aggregateRootId: '',
        eventBody: {},
        occurredOn: new Date(),
        typeName: '',
      };
      jest
        .spyOn(mockAmqpConnection, 'publish')
        .mockReturnValue(of(eventEntity));

      // Act
      eventPublisher.response = eventEntity as any;
      const result: Observable<any> = eventPublisher.publish();

      // Assert
      result.subscribe(() => {
        expect(mockAmqpConnection.publish).toHaveBeenCalledWith(
          'inventory_exchange',
          eventEntity.typeName,
          eventEntity,
        );
        done();
      });
    });
  });
});
