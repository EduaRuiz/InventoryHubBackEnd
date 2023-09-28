import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { StoredEventService, UserEntity } from '../../persistence';
import { UserRegisteredEventPublisher } from '@domain-publishers';
import { Topic } from 'src/infrastructure/utils/enums';

@Injectable()
export class UserRegisteredPublisher extends UserRegisteredEventPublisher<UserEntity> {
  constructor(
    @Inject('INVENTORY') private readonly proxy: ClientProxy,
    private readonly storedEvent: StoredEventService,
  ) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<UserEntity>(): Observable<UserEntity> {
    if (this.response && !Array.isArray(this.response))
      this.storedEvent.createStoredEvent({
        aggregateRootId: this.response.id,
        eventBody: JSON.stringify(this.response),
        occurredOn: new Date(),
        typeName: 'UserRegistered',
      });
    return this.emit(Topic.USER_REGISTERED, JSON.stringify(this.response));
  }
}
