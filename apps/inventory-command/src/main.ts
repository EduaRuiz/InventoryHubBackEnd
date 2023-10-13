import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from './infrastructure/utils/exception-filters';
import { config } from 'dotenv';
import { InventoryCommandModule } from './inventory-command.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryCommandModule);
  config();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.COMMAND_PORT || 3000);
  console.log(`🚀Application is running on: ${await app.getUrl()} COMMAND🚀`);
  console.log('RMQ', process.env.RMQ_URI);
  console.log(
    'DB',
    `${process.env.MONGO_DB_URI}/${process.env.MONGO_DB_NAME}?authSource=admin`,
  );
}
bootstrap();
