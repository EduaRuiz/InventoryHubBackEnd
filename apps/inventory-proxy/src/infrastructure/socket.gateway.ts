import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  EventDomainModel,
  ProductDomainModel,
  SaleDomainModel,
} from '@domain-models';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { TypeNameEnum } from '@enums';

@WebSocketGateway(81, {
  cors: { origin: '*' },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  afterInit(server: any) {
    console.log('Server initialized', server);
  }
  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected', client, args);
  }
  handleDisconnect(client: any) {
    console.log('Client disconnected', client);
  }

  @SubscribeMessage('inventory.join')
  handleJoin(client: Socket, branchId: string) {
    const room = `branch.${branchId}`;
    client.join(room);
    client.emit('joined', room);
    console.log('joinedOn:', room);
  }

  @SubscribeMessage('inventory.leave')
  handleLeave(client: Socket, branchId: string) {
    const room = `branch.${branchId}`;
    client.leave(room);
    client.emit('left', room);
    console.log('leftOn:', room);
  }

  @SubscribeMessage('invoice.join')
  handleJoinI(client: Socket, branchId: string) {
    const room = `branch.${branchId}`;
    client.join(room);
    client.emit('joined', room);
    console.log('joinedOn:', room);
  }

  @SubscribeMessage('invoice.leave')
  handleLeaveI(client: Socket, branchId: string) {
    const room = `branch.${branchId}`;
    client.leave(room);
    client.emit('left', room);
    console.log('leftOn:', room);
  }

  @SubscribeMessage(TypeNameEnum.PRODUCT_REGISTERED)
  handleProductAdded(client: Socket, product: ProductDomainModel) {
    this.server
      .to(`branch.${product.branchId}`)
      .emit(TypeNameEnum.PRODUCT_REGISTERED, product);
  }

  @SubscribeMessage(TypeNameEnum.PRODUCT_UPDATED)
  handleProductChanged(client: Socket, product: ProductDomainModel) {
    this.server
      .to(`branch.${product.branchId}`)
      .emit(TypeNameEnum.PRODUCT_UPDATED, product);
  }

  @SubscribeMessage(TypeNameEnum.PRODUCT_PURCHASE_REGISTERED)
  handleProductPurchased(client: Socket, product: ProductDomainModel) {
    this.server
      .to(`branch.${product.branchId}`)
      .emit(TypeNameEnum.PRODUCT_PURCHASE_REGISTERED, product);
  }

  @SubscribeMessage(TypeNameEnum.CUSTOMER_SALE_REGISTERED)
  handleCustomerSaleRegistered(client: Socket, sale: SaleDomainModel) {
    this.server
      .to(`branch.${sale.branchId}`)
      .emit(TypeNameEnum.CUSTOMER_SALE_REGISTERED, sale);
  }

  @SubscribeMessage(TypeNameEnum.SELLER_SALE_REGISTERED)
  handleSellerSaleRegistered(client: Socket, sale: SaleDomainModel) {
    this.server
      .to(`branch.${sale.branchId}`)
      .emit(TypeNameEnum.SELLER_SALE_REGISTERED, sale);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: [TypeNameEnum.PRODUCT_REGISTERED],
    queue: `${TypeNameEnum.PRODUCT_REGISTERED}.proxy`,
  })
  productRegistered(msg: EventDomainModel) {
    const productRegistered = msg.eventBody as ProductDomainModel;
    this.server
      .to(`branch.${productRegistered.branchId}`)
      .emit(TypeNameEnum.PRODUCT_REGISTERED, productRegistered);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: [TypeNameEnum.PRODUCT_UPDATED],
    queue: `${TypeNameEnum.PRODUCT_UPDATED}.proxy`,
  })
  productUpdated(msg: EventDomainModel) {
    const productUpdated = msg.eventBody as ProductDomainModel;
    this.server
      .to(`branch.${productUpdated.branchId}`)
      .emit(TypeNameEnum.PRODUCT_UPDATED, productUpdated);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: [TypeNameEnum.PRODUCT_PURCHASE_REGISTERED],
    queue: `${TypeNameEnum.PRODUCT_PURCHASE_REGISTERED}.proxy`,
  })
  productPurchase(msg: EventDomainModel) {
    const productPurchased = msg.eventBody as ProductDomainModel;
    this.server
      .to(`branch.${productPurchased.branchId}`)
      .emit(TypeNameEnum.PRODUCT_PURCHASE_REGISTERED, productPurchased);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: [TypeNameEnum.SELLER_SALE_REGISTERED],
    queue: `${TypeNameEnum.SELLER_SALE_REGISTERED}.proxy`,
  })
  sellerSaleRegistered(msg: EventDomainModel) {
    const sellerSale = msg.eventBody as SaleDomainModel;
    this.server
      .to(`branch.${sellerSale.branchId}`)
      .emit(TypeNameEnum.SELLER_SALE_REGISTERED, sellerSale);
  }

  @RabbitSubscribe({
    exchange: 'inventory_exchange',
    routingKey: [TypeNameEnum.CUSTOMER_SALE_REGISTERED],
    queue: `${TypeNameEnum.CUSTOMER_SALE_REGISTERED}.proxy`,
  })
  customerSaleRegistered(msg: EventDomainModel) {
    console.log(msg);
    const customerSale = msg.eventBody as SaleDomainModel;
    this.server
      .to(`branch.${customerSale.branchId}`)
      .emit(TypeNameEnum.CUSTOMER_SALE_REGISTERED, customerSale);
  }
}
