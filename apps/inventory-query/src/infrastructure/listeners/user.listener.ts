﻿import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { UserRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Controller()
export class UserListener {
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    // exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.USER_REGISTERED,
    queue: TypeNameEnum.USER_REGISTERED + '.query',
  })
  public userRegistered(msg: EventDomainModel): void {
    console.info('User registered event received');
    this.userRegisteredUseCase.execute(msg);
  }
}
