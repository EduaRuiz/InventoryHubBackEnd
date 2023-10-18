import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './utils/strategies';
import { MailService } from './utils/services';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PassportModule,
    PersistenceModule,
  ],
  controllers: [],
  providers: [JwtStrategy, MailService],
  exports: [PersistenceModule, JwtModule, PassportModule, MailService],
})
export class InfrastructureModule {}
