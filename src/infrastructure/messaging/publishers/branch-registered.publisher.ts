import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { BranchEntity, StoredEventService } from '../../persistence';
import { BranchRegisteredEventPublisher } from '@domain-publishers';
import { Topic } from 'src/infrastructure/utils/enums';

@Injectable()
export class BranchRegisteredPublisher extends BranchRegisteredEventPublisher<BranchEntity> {
  constructor(
    @Inject('INVENTORY') private readonly proxy: ClientProxy,
    private readonly storedEvent: StoredEventService,
  ) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<BranchEntity>(): Observable<BranchEntity> {
    if (this.response && !Array.isArray(this.response))
      this.storedEvent.createStoredEvent({
        aggregateRootId: this.response.id,
        eventBody: JSON.stringify(this.response),
        occurredOn: new Date(),
        typeName: 'BranchRegistered',
      });
    return this.emit(Topic.BRANCH_REGISTERED, JSON.stringify(this.response));
  }
}
