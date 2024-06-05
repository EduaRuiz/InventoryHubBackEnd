import { Module } from '@nestjs/common';
import { EventService, PersistenceModule } from './persistence';
import { EventPublisher, MessagingModule } from './messaging';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigService, MailService, SeedService } from './utils/services';
import { SeedUserUseCase } from '@use-cases-command/user';

@Module({
  imports: [
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PersistenceModule,
    MessagingModule,
  ],
  controllers: [],
  providers: [
    MailService,
    {
      provide: SeedUserUseCase,
      useFactory: (
        storeService: EventService,
        eventPublisher: EventPublisher,
        mailService: MailService,
      ) => new SeedUserUseCase(storeService, eventPublisher, mailService),
      inject: [EventService, EventPublisher, MailService],
    },
    SeedService,
  ],
  exports: [
    PersistenceModule,
    MessagingModule,
    JwtModule,
    PassportModule,
    MailService,
  ],
})
export class InfrastructureModule {}
