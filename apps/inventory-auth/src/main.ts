import { NestFactory } from '@nestjs/core';
import { InventoryAuthModule } from './inventory-auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';

async function bootstrap() {
  const app = await NestFactory.create(InventoryAuthModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.AUTH_PORT || 3003);
}
bootstrap();
