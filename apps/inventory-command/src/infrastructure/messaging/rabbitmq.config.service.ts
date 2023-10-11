import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQConfigService {
  constructor(private readonly configService: ConfigService) {}
  getRabbitMQOptions(): RabbitMQConfig {
    return {
      exchanges: [
        {
          name: 'inventory_exchange',
          type: 'topic',
          createExchangeIfNotExists: true,
          options: {
            durable: true,
            autoDelete: false,
            internal: false,
          },
        },
      ],
      uri:
        this.configService.get<string>('RMQ_URI') ||
        'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    };
  }
}
