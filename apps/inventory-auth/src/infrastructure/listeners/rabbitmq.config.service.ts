import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQConfigService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(): RabbitMQConfig {
    const exchange = {
      name: this.configService.get<string>('RABBITMQ_DEFAULT_EXCHANGE') || '',
      type: 'topic',
      createExchangeIfNotExists: true,
      options: {
        durable: true,
        autoDelete: false,
        internal: false,
      },
    };
    const user = this.configService.get<string>('RABBITMQ_DEFAULT_USER');
    const password = this.configService.get<string>('RABBITMQ_DEFAULT_PASS');
    const host = this.configService.get<string>('RABBITMQ_DEFAULT_HOST');
    const port = this.configService.get<number>('RABBITMQ_DEFAULT_PORT');
    const uri = `amqp://${user}:${password}@${host}:${port}`;
    return {
      exchanges: [exchange],
      uri,
      connectionInitOptions: { wait: true },
    };
  }
}
