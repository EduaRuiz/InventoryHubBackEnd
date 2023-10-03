import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { EventEntity } from '../../persistence';
import { DomainEventPublisher } from '@domain-publishers';

@Injectable()
export class EventPublisher extends DomainEventPublisher<EventEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<EventEntity>(): Observable<EventEntity> {
    if (this.response && !Array.isArray(this.response)) {
      return this.emit(this.response.typeName, JSON.stringify(this.response));
    }
    return this.emit('unknown', JSON.stringify(this.response));
  }
}
