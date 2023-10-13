import { NestFactory } from '@nestjs/core';
import { InventoryAuthModule } from './inventory-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryAuthModule);
  app.enableCors();
  await app.listen(3003);
}
bootstrap();
