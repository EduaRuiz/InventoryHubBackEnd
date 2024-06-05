import { Module } from '@nestjs/common';
import { AuthService, JwtConfigService } from './utils/services';
import { PersistenceModule } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { ListenerModule } from './listeners';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PersistenceModule,
    ListenerModule,
  ],
  controllers: [],
  providers: [AuthService],
  exports: [JwtModule, PersistenceModule, ListenerModule, AuthService],
})
export class InfrastructureModule {}
