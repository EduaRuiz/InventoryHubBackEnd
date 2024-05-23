import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, JwtConfigService } from './utils/strategies';
import { MailService } from './utils/services';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule,
    PersistenceModule,
  ],
  controllers: [],
  providers: [JwtStrategy, JwtConfigService, MailService],
  exports: [PersistenceModule, JwtModule, PassportModule, MailService],
})
export class InfrastructureModule {}
