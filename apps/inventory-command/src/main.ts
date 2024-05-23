import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from './infrastructure/utils/exception-filters';
import { InventoryCommandModule } from './inventory-command.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryCommandModule);

  //Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('inventory-command')
    .setDescription('Api Inventory Command')
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
  await app.listen(process.env.COMMAND_PORT || 3000);

  //Console log
  console.log(`🚀Application is running on: ${await app.getUrl()} COMMAND🚀`);
  console.log('RMQ', process.env.RMQ_URI);
  console.log(
    'DB',
    `postgresql://${process.env.POSTGRES_DB_USER}:${process.env.POSTGRES_DB_PASSWORD}@${process.env.POSTGRES_DB_HOST}:${process.env.POSTGRES_DB_PORT}/${process.env.POSTGRES_DB_NAME}`,
  );
}
bootstrap();
