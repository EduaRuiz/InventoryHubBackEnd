import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { ProductEntity } from '../../persistence';
import { SellerSaleRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class SellerSaleRegisteredPublisher extends SellerSaleRegisteredEventPublisher<ProductEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<ProductEntity>(): Observable<ProductEntity> {
    return this.emit(this.response, this.response);
  }
}
