import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { EventEntity } from '../../persistence';
import { DomainEventPublisher } from '@domain/events/publishers';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class EventPublisher extends DomainEventPublisher<EventEntity> {
  constructor(private readonly amqpConnection: AmqpConnection) {
    super();
  }

  publish<EventEntity>(): Observable<EventEntity> {
    return from(
      this.amqpConnection.publish(
        'inventory_exchange',
        this.response.typeName,
        this.response,
      ),
    );
  }
}
