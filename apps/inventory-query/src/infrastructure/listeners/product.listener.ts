import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  ProductUpdatedUseCase,
  SaleRegisteredUseCase,
} from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Controller()
export class ProductListener {
  constructor(
    private readonly productRegisteredUseCase: ProductRegisteredUseCase,
    private readonly productPurchaseRegisteredUseCase: ProductPurchaseRegisteredUseCase,
    private readonly saleRegisteredUseCase: SaleRegisteredUseCase,
    private readonly productUpdatedUseCase: ProductUpdatedUseCase,
  ) {}

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_PURCHASE_REGISTERED,
    queue: `${TypeNameEnum.PRODUCT_PURCHASE_REGISTERED}.query`,
  })
  public productPurchaseRegistered(msg: EventDomainModel): void {
    this.productPurchaseRegisteredUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_REGISTERED,
    queue: TypeNameEnum.PRODUCT_REGISTERED + '.query',
  })
  public productRegistered(msg: EventDomainModel): void {
    this.productRegisteredUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.PRODUCT_UPDATED,
    queue: TypeNameEnum.PRODUCT_UPDATED + '.query',
  })
  public productUpdated(msg: EventDomainModel): void {
    this.productUpdatedUseCase.execute(msg);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.CUSTOMER_SALE_REGISTERED,
    queue: TypeNameEnum.CUSTOMER_SALE_REGISTERED + '.query',
  })
  public customerSaleRegistered(msg: EventDomainModel): void {
    this.saleRegisteredUseCase.execute(msg).subscribe();
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: TypeNameEnum.SELLER_SALE_REGISTERED,
    queue: TypeNameEnum.SELLER_SALE_REGISTERED + '.query',
  })
  public sellerSaleRegistered(msg: EventDomainModel): void {
    this.saleRegisteredUseCase.execute(msg).subscribe();
  }
}
