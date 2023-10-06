import { NestFactory } from '@nestjs/core';
import { EventConsumerModule } from './event-consumer.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EventConsumerModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3001);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} CONSUMER 🚀`,
  );
}
bootstrap();
