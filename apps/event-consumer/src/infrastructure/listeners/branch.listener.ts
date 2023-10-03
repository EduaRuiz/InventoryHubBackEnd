import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { Event } from '../utils/events';
import { BranchRegisteredUseCase } from '@use-cases-con/index';

@Controller()
export class BranchListener {
  constructor(
    private readonly branchRegisteredUseCase: BranchRegisteredUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'branch_registered',
    queue: 'inventory.branch_registered',
  })
  public branchRegistered(msg: string): void {
    const event: Event = JSON.parse(msg);
    this.branchRegisteredUseCase.execute(event);
  }
}
