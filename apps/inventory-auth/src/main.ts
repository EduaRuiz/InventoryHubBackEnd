import { NestFactory } from '@nestjs/core';
import { InventoryAuthModule } from './inventory-auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryAuthModule);
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('inventory-auth')
    .setDescription('Api Inventory Auth')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValueObjectExceptionFilter());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(process.env.AUTH_PORT || 3003);
}
bootstrap();
