import { NestFactory } from '@nestjs/core';
import { InventoryProxyModule } from './inventory-proxy.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';

async function bootstrap() {
  const app = await NestFactory.create(InventoryProxyModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PROXY_PORT || 3002);
  console.log(`🚀Application is running on: ${await app.getUrl()}  PROXY🚀`);
  console.log('RMQ', process.env.RMQ_URI);
}
bootstrap();
