import { Module } from '@nestjs/common';
import { PersistenceModule } from './persistence';
import { MessagingModule } from './messaging';

@Module({
  imports: [PersistenceModule, MessagingModule],
  controllers: [],
  providers: [],
  exports: [PersistenceModule, MessagingModule],
})
export class InfrastructureModule {}
