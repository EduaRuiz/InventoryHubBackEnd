import { Controller, Get } from '@nestjs/common';
import { EventConsumerService } from './event-consumer.service';

@Controller()
export class EventConsumerController {
  constructor(private readonly eventConsumerService: EventConsumerService) {}

  @Get()
  getHello(): string {
    return this.eventConsumerService.getHello();
  }
}
