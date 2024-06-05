import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { UserRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Injectable()
export class UserListener {
  private exchange: string | undefined;
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'inventory_exchange',
    routingKey: TypeNameEnum.USER_REGISTERED,
    queue: TypeNameEnum.USER_REGISTERED + '.query',
  })
  public userRegistered(msg: EventDomainModel): void {
    console.info('User registered event received');
    this.userRegisteredUseCase.execute(msg);
  }
}
