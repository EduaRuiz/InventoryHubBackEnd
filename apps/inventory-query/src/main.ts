import { NestFactory } from '@nestjs/core';
import { InventoryQueryModule } from './inventory-query.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(InventoryQueryModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.QUERY_PORT || 3001);
  console.log(`🚀Application is running on: ${await app.getUrl()} QUERY🚀`);
  console.log('RMQ', process.env.RMQ_URI);
  console.log(
    'DB',
    `postgresql://${process.env.POSTGRES_DB_USER}:${process.env.POSTGRES_DB_PASSWORD}@${process.env.POSTGRES_DB_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`,
  );
}
bootstrap();
