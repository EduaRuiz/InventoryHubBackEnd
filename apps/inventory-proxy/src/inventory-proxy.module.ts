import { Module } from '@nestjs/common';
import { SocketGateway } from './infrastructure';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(
        process.cwd(),
        'environments',
        `.env.${process.env.SCOPE?.trimEnd()}`,
      ),
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const exchange = {
          name: configService.get<string>('RABBITMQ_DEFAULT_EXCHANGE') || '',
          type: 'topic',
          createExchangeIfNotExists: true,
          options: {
            durable: true,
            autoDelete: false,
            internal: false,
          },
        };
        const user = configService.get<string>('RABBITMQ_DEFAULT_USER');
        const password = configService.get<string>('RABBITMQ_DEFAULT_PASS');
        const host = configService.get<string>('RABBITMQ_DEFAULT_HOST');
        const port = configService.get<number>('RABBITMQ_DEFAULT_PORT');
        const uri = `amqp://${user}:${password}@${host}:${port}`;
        return {
          exchanges: [exchange],
          uri,
          connectionInitOptions: { wait: false },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [SocketGateway],
})
export class InventoryProxyModule {}
