import { Module } from '@nestjs/common';
import { EventPublisher } from './publishers';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      exchanges: [
        {
          name: 'inventory-hub-exchange',
          type: 'topic',
          createExchangeIfNotExists: true,
          options: {
            durable: true,
            autoDelete: false,
            internal: false,
          },
        },
      ],
      uri: 'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [],
  providers: [EventPublisher],
  exports: [EventPublisher],
})
export class MessagingModule {}
