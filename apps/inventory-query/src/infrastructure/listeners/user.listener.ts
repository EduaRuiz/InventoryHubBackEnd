﻿import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { UserRegisteredUseCase } from '@use-cases-con/index';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Controller()
export class UserListener {
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.USER_REGISTERED,
    queue: TypeNameEnum.USER_REGISTERED + '.view',
  })
  public userRegistered(msg: EventDomainModel): void {
    this.userRegisteredUseCase.execute(msg);
  }
}