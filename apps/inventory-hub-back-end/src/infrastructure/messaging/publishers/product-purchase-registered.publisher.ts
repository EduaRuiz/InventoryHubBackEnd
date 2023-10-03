import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { ProductEntity } from '../../persistence';
import { ProductPurchaseRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class ProductPurchaseRegisteredPublisher extends ProductPurchaseRegisteredEventPublisher<ProductEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<ProductEntity>(): Observable<ProductEntity> {
    return this.emit(this.response, this.response);
  }
}
