import { Module } from '@nestjs/common';
import { EventPublisher } from './publishers';
import { RabbitMQConfigService } from './rabbitmq.config.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [MessagingModule],
      useFactory: async (rabbitMQConfigService: RabbitMQConfigService) => {
        return rabbitMQConfigService.getOptions();
      },
      inject: [RabbitMQConfigService],
    }),
  ],
  controllers: [],
  providers: [EventPublisher, RabbitMQConfigService],
  exports: [EventPublisher, RabbitMQConfigService],
})
export class MessagingModule {}
