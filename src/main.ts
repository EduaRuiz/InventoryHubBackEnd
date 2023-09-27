import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://root:password@localhost:5672'],
  //     queue: 'other',
  //     queueOptions: { durable: false },
  //   },
  // });
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
