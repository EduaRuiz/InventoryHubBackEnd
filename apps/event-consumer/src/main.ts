import { NestFactory } from '@nestjs/core';
import { EventConsumerModule } from './event-consumer.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(EventConsumerModule);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://root:password@localhost:5672'],
      queue: 'inventory_queue',
      queueOptions: { durable: false },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} CONSUMER 🚀`,
  );
}
bootstrap();
