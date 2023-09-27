import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { lastValueFrom } from 'rxjs';
import { ProductEntity } from '../../persistence';
import { ProductRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class ProductRegisteredPublisher extends ProductRegisteredEventPublisher<ProductEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  emit<Result = any, Input = ProductEntity>(
    pattern: any,
    data: Input,
  ): Promise<Result> {
    return lastValueFrom(this.proxy.emit(pattern, data));
  }
}
