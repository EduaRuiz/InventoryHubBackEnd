import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './utils/strategies/jwt.strategy';

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
  providers: [JwtStrategy],
  exports: [PersistenceModule, JwtModule, PassportModule],
})
export class InfrastructureModule {}
