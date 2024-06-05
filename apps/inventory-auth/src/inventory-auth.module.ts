import { Module } from '@nestjs/common';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

import { InfrastructureModule } from './infrastructure';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  UserRegisteredUseCase,
} from '@use-cases-auth';
import { UserService } from './infrastructure/persistence/services';
import { AuthController } from './infrastructure/controllers';
import { AuthService } from './infrastructure/utils/services';
import { UserListener } from './infrastructure/listeners';

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
    InfrastructureModule,
  ],
  controllers: [AuthController, UserListener],
  providers: [
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
    UserListener,
  ],
})
export class InventoryAuthModule {}
