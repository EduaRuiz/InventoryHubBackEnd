import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { BranchEntity } from '../../persistence';
import { BranchRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class BranchRegisteredPublisher extends BranchRegisteredEventPublisher<BranchEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<BranchEntity>(): Observable<BranchEntity> {
    return this.emit(this.response, this.response);
  }
}
