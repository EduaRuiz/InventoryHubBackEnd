import { Injectable } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { EventEntity } from '../../persistence';
import { DomainEventPublisher } from '@domain/events/publishers';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EventPublisher extends DomainEventPublisher<EventEntity> {
  constructor(
    private readonly configService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {
    super();
  }

  publish<EventEntity>(): Observable<EventEntity> {
    console.log('Publishing event');
    return from(
      this.amqpConnection.publish(
        this.configService.get<string>('RABBITMQ_DEFAULT_EXCHANGE') || '',
        this.response.typeName,
        this.response,
      ),
    );
  }
}
