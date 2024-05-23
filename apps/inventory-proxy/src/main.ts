import { NestFactory } from '@nestjs/core';
import { InventoryProxyModule } from './inventory-proxy.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';

async function bootstrap() {
  const app = await NestFactory.create(InventoryProxyModule);

  //Global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.PROXY_PORT || 3002);

  //Console log
  console.log(`🚀Application is running on: ${await app.getUrl()}  PROXY🚀`);
  console.log('RMQ', process.env.RMQ_URI);
  console.log(
    'DB',
    `postgresql://${process.env.POSTGRES_DB_USER}:${process.env.POSTGRES_DB_PASSWORD}@${process.env.POSTGRES_DB_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`,
  );
}
bootstrap();
