import { Injectable } from '@nestjs/common';

@Injectable()
export class EventConsumerService {
  getHello(): string {
    return 'Hello World!';
  }
}
