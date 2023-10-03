import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Event } from '../utils/events';
import {
  CustomerSaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  SellerSaleRegisteredUseCase,
} from '@use-cases-con';

@Controller()
export class ProductListener {
  constructor(
    private readonly productRegisteredUseCase: ProductRegisteredUseCase,
    private readonly productPurchaseRegisteredUseCase: ProductPurchaseRegisteredUseCase,
    private readonly customerSaleRegisteredUseCase: CustomerSaleRegisteredUseCase,
    private readonly sellerSaleRegisteredUseCase: SellerSaleRegisteredUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'product_purchase_registered',
    queue: 'inventory.product_purchase_registered',
  })
  public productPurchaseRegistered(msg: string): void {
    const event: Event = JSON.parse(msg);
    this.productPurchaseRegisteredUseCase.execute(event);
  }

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'product_registered',
    queue: 'inventory.product_registered',
  })
  public productRegistered(msg: object): void {
    const event: Event = JSON.parse(JSON.stringify(msg));
    this.productRegisteredUseCase.execute(event);
  }

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'customer_sale_registered',
    queue: 'inventory.customer_sale_registered',
  })
  public customerSaleRegistered(msg: object): void {
    const event: Event = JSON.parse(JSON.stringify(msg));
    this.customerSaleRegisteredUseCase.execute(event);
  }

  @RabbitSubscribe({
    exchange: 'inventory-hub-exchange',
    routingKey: 'seller_sale_registered',
    queue: 'inventory.seller_sale_registered',
  })
  public sellerSaleRegistered(msg: object): void {
    const event: Event = JSON.parse(JSON.stringify(msg));
    this.sellerSaleRegisteredUseCase.execute(event);
  }
}
