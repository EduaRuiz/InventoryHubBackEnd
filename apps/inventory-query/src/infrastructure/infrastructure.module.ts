import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigService } from './utils/strategies';
import { MailService } from './utils/services';
import { ListenerModule } from './listeners';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PersistenceModule,
    ListenerModule,
  ],
  controllers: [],
  providers: [MailService],
  exports: [
    JwtModule,
    PassportModule,
    PersistenceModule,
    ListenerModule,
    MailService,
  ],
})
export class InfrastructureModule {}
