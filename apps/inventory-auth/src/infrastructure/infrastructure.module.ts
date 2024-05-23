import { Module } from '@nestjs/common';
import { AuthService, JwtConfigService } from './utils/services';
import { PersistenceModule, UserService } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { UserListener } from './listeners';
import { AuthController } from './controllers';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  UserRegisteredUseCase,
} from '@use-cases-auth';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(
          'RMQ_URI',
          process.env.RMQ_URI || 'amqp://localhost:5672',
        ),
        connectionInitOptions: { wait: false },
      }),
      inject: [ConfigService],
    }),
    PersistenceModule,
  ],
  controllers: [UserListener, AuthController],
  providers: [
    AuthService,
    JwtConfigService,
    UserListener,
    {
      provide: UserRegisteredUseCase,
      useFactory: (userService: UserService) =>
        new UserRegisteredUseCase(userService),
      inject: [UserService],
    },
    {
      provide: LoginUseCase,
      useFactory: (userService: UserService, authService: AuthService) =>
        new LoginUseCase(userService, authService),
      inject: [UserService, AuthService],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (userService: UserService, authService: AuthService) =>
        new RefreshTokenUseCase(userService, authService),
      inject: [UserService, AuthService],
    },
  ],
  exports: [PersistenceModule, JwtModule, RabbitMQModule],
})
export class InfrastructureModule {}
