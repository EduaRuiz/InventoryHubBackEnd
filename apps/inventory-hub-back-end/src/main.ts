import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from './infrastructure/utils/exception-filters';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(
    `🚀 Application is running on: ${await app.getUrl()} INVENTORY 🚀`,
  );
}
bootstrap();
