import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EventDomainModel } from '@domain-models';

@Controller()
export class ProductListener {
  constructor() {}

  @EventPattern('product_registered')
  handleProductRegistered(@Payload() data: string, @Ctx() context: RmqContext) {
    const toManage: EventDomainModel = JSON.parse(data);
    console.log('Product registered: ', toManage);
    console.log('Channel: ', context.getChannelRef());
  }
}
