import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';
import { UserRegisteredUseCase } from '../../application';

@Controller()
export class UserListener {
  constructor(private readonly userRegisteredUseCase: UserRegisteredUseCase) {}

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.USER_REGISTERED,
    queue: TypeNameEnum.USER_REGISTERED + '.auth',
  })
  public userRegistered(msg: EventDomainModel): void {
    this.userRegisteredUseCase.execute(msg);
  }
}
