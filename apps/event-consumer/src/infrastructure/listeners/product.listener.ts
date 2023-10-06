import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Event } from '../utils/events';
import {
  CustomerSaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  ProductUpdatedUseCase,
  SellerSaleRegisteredUseCase,
} from '@use-cases-con';
import { EventDomainModel } from '@domain-models/event.domain-model';
import { TypeNameEnum } from '@enums';

@Controller()
export class ProductListener {
  constructor(
    private readonly productRegisteredUseCase: ProductRegisteredUseCase,
    private readonly productPurchaseRegisteredUseCase: ProductPurchaseRegisteredUseCase,
    private readonly customerSaleRegisteredUseCase: CustomerSaleRegisteredUseCase,
    private readonly sellerSaleRegisteredUseCase: SellerSaleRegisteredUseCase,
    private readonly productUpdatedUseCase: ProductUpdatedUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
    queue: `${TypeNameEnum.PRODUCT_PURCHASE_REGISTERED}.view`,
  })
  public productPurchaseRegistered(msg: EventDomainModel): void {
    this.productPurchaseRegisteredUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_REGISTERED,
    queue: TypeNameEnum.PRODUCT_REGISTERED + '.view',
  })
  public productRegistered(msg: EventDomainModel): void {
    this.productRegisteredUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_UPDATED,
    queue: TypeNameEnum.PRODUCT_UPDATED + '.view',
  })
  public productUpdated(msg: EventDomainModel): void {
    this.productUpdatedUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.CUSTOMER_SALE_REGISTERED,
    queue: TypeNameEnum.CUSTOMER_SALE_REGISTERED + '.view',
  })
  public customerSaleRegistered(msg: EventDomainModel): void {
    this.customerSaleRegisteredUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.SELLER_SALE_REGISTERED,
    queue: TypeNameEnum.SELLER_SALE_REGISTERED + '.view',
  })
  public sellerSaleRegistered(msg: object): void {
    const event: Event = JSON.parse(JSON.stringify(msg));
    this.sellerSaleRegisteredUseCase.execute(event);
  }
}
