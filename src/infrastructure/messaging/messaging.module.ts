import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  BranchRegisteredPublisher,
  CustomerSaleRegisteredPublisher,
  ProductPurchaseRegisteredPublisher,
  ProductRegisteredPublisher,
  SellerSaleRegisteredPublisher,
  UserRegisteredPublisher,
} from './publishers';
import { PersistenceModule } from '../persistence';

/**
 * Modulo de mensajería
 *
 * @export
 * @class MessagingModule
 */
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://root:password@localhost:5672'],
          queue: 'inventory_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    PersistenceModule,
  ],
  controllers: [],
  providers: [
    ProductRegisteredPublisher,
    ProductPurchaseRegisteredPublisher,
    BranchRegisteredPublisher,
    UserRegisteredPublisher,
    SellerSaleRegisteredPublisher,
    CustomerSaleRegisteredPublisher,
  ],
  exports: [
    ProductRegisteredPublisher,
    ProductPurchaseRegisteredPublisher,
    BranchRegisteredPublisher,
    UserRegisteredPublisher,
    SellerSaleRegisteredPublisher,
    CustomerSaleRegisteredPublisher,
  ],
})
export class MessagingModule {}
