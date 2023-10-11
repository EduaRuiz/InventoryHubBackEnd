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
}
bootstrap();
