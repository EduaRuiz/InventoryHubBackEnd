import { Module } from '@nestjs/common';
import { RabbitMQConfigService } from './infrastructure/listeners';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { InfrastructureModule } from './infrastructure';

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
      imports: [InfrastructureModule],
      useFactory: async (rabbitMQConfigService: RabbitMQConfigService) => {
        return rabbitMQConfigService.getOptions();
      },
      inject: [RabbitMQConfigService],
    }),
    InfrastructureModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class InventoryQueryModule {}
