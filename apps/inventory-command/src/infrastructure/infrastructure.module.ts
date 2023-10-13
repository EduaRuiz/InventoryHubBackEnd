import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { MessagingModule } from './messaging';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

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
  providers: [],
  exports: [PersistenceModule, MessagingModule, JwtModule, PassportModule],
})
export class InfrastructureModule {}
