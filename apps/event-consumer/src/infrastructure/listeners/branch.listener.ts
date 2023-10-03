import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class BranchListener {
  constructor() {}

  @EventPattern([
    'branch_registered',
    'product_registered',
    'user_registered',
    'product_purchase_registered',
    'customer_sale_registered',
    'seller_sale_registered',
  ])
  handleBranchRegistered(
    @Payload() data: string,
    @Ctx() context: RmqContext,
  ): void {
    const toManage = JSON.parse(data);
    console.log(context.getPattern(), toManage);
    console.log(`Pattern: ${context.getPattern()}`);
  }
}
