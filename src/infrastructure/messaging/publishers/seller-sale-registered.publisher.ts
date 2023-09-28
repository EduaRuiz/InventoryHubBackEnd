import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { ProductEntity, StoredEventService } from '../../persistence';
import { SellerSaleRegisteredEventPublisher } from '@domain-publishers';
import { Topic } from 'src/infrastructure/utils/enums';

@Injectable()
export class SellerSaleRegisteredPublisher extends SellerSaleRegisteredEventPublisher<ProductEntity> {
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
        typeName: 'SellerSaleRegistered',
      });
    return this.emit(
      Topic.SELLER_SALE_REGISTERED,
      JSON.stringify(this.response),
    );
  }
}
