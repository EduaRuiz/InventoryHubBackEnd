import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { Event } from '../utils/events';
import { UserRegisteredUseCase } from '@use-cases-con/index';

@Controller()
export class UserListener {
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'user_registered',
    queue: 'inventory.user_registered',
  })
  public userRegistered(msg: string): void {
    const event: Event = JSON.parse(msg);
    this.userRegisteredUseCase.execute(event);
  }
}
