﻿import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { BranchRegisteredUseCase } from '@use-cases-con/index';
import { EventDomainModel } from '@domain-models/event.domain-model';
import { TypeNameEnum } from '@enums';

@Controller()
export class BranchListener {
  constructor(
    private readonly branchRegisteredUseCase: BranchRegisteredUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.BRANCH_REGISTERED,
    queue: TypeNameEnum.BRANCH_REGISTERED + '.view',
  })
  public branchRegistered(msg: EventDomainModel): void {
    this.branchRegisteredUseCase.execute(msg);
  }
}
