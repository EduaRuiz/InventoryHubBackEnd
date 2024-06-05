import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { BranchRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Controller()
export class BranchListener {
  constructor(
    private readonly branchRegisteredUseCase: BranchRegisteredUseCase,
  ) {}

  @RabbitSubscribe({
    // exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.BRANCH_REGISTERED,
    queue: TypeNameEnum.BRANCH_REGISTERED + '.query',
  })
  public branchRegistered(msg: EventDomainModel): void {
    this.branchRegisteredUseCase.execute(msg);
  }
}
