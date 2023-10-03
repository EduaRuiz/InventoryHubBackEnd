import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { ProductEntity } from '../../persistence';
import { CustomerSaleRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class CustomerSaleRegisteredPublisher extends CustomerSaleRegisteredEventPublisher<ProductEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<ProductEntity>(): Observable<ProductEntity> {
    return this.emit(this.response, this.response);
  }
}
