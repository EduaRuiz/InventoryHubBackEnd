import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IEventPublisher } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { UserEntity } from '../../persistence';
import { UserRegisteredEventPublisher } from '@domain-publishers';

@Injectable()
export class UserRegisteredPublisher extends UserRegisteredEventPublisher<UserEntity> {
  constructor(@Inject('INVENTORY') private readonly proxy: ClientProxy) {
    super(proxy as unknown as IEventPublisher);
  }

  publish<UserEntity>(): Observable<UserEntity> {
    return this.emit(this.response, this.response);
  }
}
