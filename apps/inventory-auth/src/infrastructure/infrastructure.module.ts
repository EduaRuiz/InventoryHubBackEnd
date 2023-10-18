import { Module } from '@nestjs/common';
import { AuthService } from './utils/services';
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

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '2h' },
    }),
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: process.env.RMQ_URI || 'amqp://root:password@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    PersistenceModule,
  ],
  controllers: [UserListener, AuthController],
  providers: [
    AuthService,
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
