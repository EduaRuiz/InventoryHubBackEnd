import { NestFactory } from '@nestjs/core';
import { InventoryProxyModule } from './inventory-proxy.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryProxyModule);
  await app.listen(process.env.PROXY_PORT || 3002);
  console.log(`🚀Application is running on: ${await app.getUrl()}  PROXY🚀`);
}
bootstrap();
