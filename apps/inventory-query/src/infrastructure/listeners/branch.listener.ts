import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { BranchRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Injectable()
export class BranchListener {
  constructor(
    private readonly branchRegisteredUseCase: BranchRegisteredUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_DEFAULT_EXCHANGE || 'inventory_exchange',
    routingKey: TypeNameEnum.BRANCH_REGISTERED,
    queue: TypeNameEnum.BRANCH_REGISTERED + '.query',
  })
  public branchRegistered(msg: EventDomainModel): void {
    this.branchRegisteredUseCase.execute(msg);
  }
}
