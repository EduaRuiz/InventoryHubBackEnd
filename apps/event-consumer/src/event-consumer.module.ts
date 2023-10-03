import { Module } from '@nestjs/common';
import { EventConsumerController } from './event-consumer.controller';
import { EventConsumerService } from './event-consumer.service';
import { BranchListener } from './infrastructure/listeners/branch.listener';

@Module({
  imports: [],
  controllers: [EventConsumerController, BranchListener],
  providers: [EventConsumerService],
})
export class EventConsumerModule {}
