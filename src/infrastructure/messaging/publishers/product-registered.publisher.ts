import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { ProductEntity, StoredEventService } from '../../persistence';
import { ProductRegisteredEventPublisher } from '@domain-publishers';
import { Topic } from 'src/infrastructure/utils/enums';

@Injectable()
export class ProductRegisteredPublisher extends ProductRegisteredEventPublisher<ProductEntity> {
  constructor(
    @Inject('INVENTORY') private readonly proxy: ClientProxy,
    private readonly storedEvent: StoredEventService,
  ) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<ProductEntity>(): Observable<ProductEntity> {
    if (this.response && !Array.isArray(this.response))
      this.storedEvent.createStoredEvent({
        aggregateRootId: this.response.branchId,
        eventBody: JSON.stringify(this.response),
        occurredOn: new Date(),
        typeName: 'ProductRegistered',
      });
    return this.emit(Topic.PRODUCT_REGISTERED, JSON.stringify(this.response));
  }
}
