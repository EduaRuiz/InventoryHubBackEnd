import { NestFactory } from '@nestjs/core';
import { InventoryQueryModule } from './inventory-query.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryQueryModule);

  //Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('inventory-query')
    .setDescription('Api Inventory Query')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

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
  await app.listen(process.env.QUERY_PORT || 3001);

  //Console log
  console.log(`🚀Application is running on: ${await app.getUrl()} QUERY🚀`);
  console.log('RMQ', process.env.RMQ_URI);
  console.log(
    'DB',
    `postgresql://${process.env.POSTGRES_DB_USER}:${process.env.POSTGRES_DB_PASSWORD}@${process.env.POSTGRES_DB_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`,
  );
}
bootstrap();
