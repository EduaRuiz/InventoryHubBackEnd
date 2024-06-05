import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQConfigService } from './infrastructure/listeners';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from './infrastructure/utils/services';
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
      imports: [InventoryAuthModule],
      useFactory: async (rabbitMQConfigService: RabbitMQConfigService) => {
        return rabbitMQConfigService.getOptions();
      },
      inject: [RabbitMQConfigService],
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    InfrastructureModule,
  ],
  controllers: [],
  providers: [RabbitMQConfigService],
  exports: [RabbitMQConfigService],
})
export class InventoryAuthModule {}
