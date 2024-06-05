import { Module } from '@nestjs/common';
import { UserService } from './persistence/services';
import { UserListener } from './listeners';
import {
  LoginUseCase,
  RefreshTokenUseCase,
  UserRegisteredUseCase,
} from '@use-cases-auth';
import { PersistenceModule } from './persistence';
import { AuthController } from './controllers';
import { AuthService } from './utils/services';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PersistenceModule, JwtModule],
  controllers: [AuthController, UserListener],
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
  exports: [PersistenceModule, AuthService],
})
export class InfrastructureModule {}
