import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { MessagingModule } from './messaging';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
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
    MessagingModule,
  ],
  controllers: [],
  providers: [MailService],
  exports: [
    PersistenceModule,
    MessagingModule,
    JwtModule,
    PassportModule,
    MailService,
  ],
})
export class InfrastructureModule {}
