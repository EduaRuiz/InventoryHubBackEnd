import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { UserRegisteredUseCase } from '@use-cases-auth';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Injectable()
export class UserListener {
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'inventory_exchange',
    routingKey: TypeNameEnum.USER_REGISTERED,
    queue: TypeNameEnum.USER_REGISTERED + '.auth',
  })
  public userRegistered(msg: EventDomainModel): void {
    console.info(process.env.RABBITMQ_DEFAULT_EXCHANGE);
    console.info('User registered event received');
    this.userRegisteredUseCase.execute(msg);
  }
}
