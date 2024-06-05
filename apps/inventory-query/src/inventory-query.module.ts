import { Module } from '@nestjs/common';
import { RabbitMQConfigService } from './infrastructure/listeners';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { JwtModule } from '@nestjs/jwt';
import { InfrastructureModule, JwtConfigService } from './infrastructure';
import { PassportModule } from '@nestjs/passport';

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
      imports: [InventoryQueryModule],
      useFactory: async (rabbitMQConfigService: RabbitMQConfigService) => {
        return rabbitMQConfigService.getOptions();
      },
      inject: [RabbitMQConfigService],
    }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    InfrastructureModule,
  ],
  controllers: [],
  providers: [RabbitMQConfigService],
  exports: [RabbitMQConfigService],
})
export class InventoryQueryModule {}
