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
  console.log(
    'RMQ',
    `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`,
  );
  console.log(
    'DB',
    `postgresql://${process.env.POSTGRES_DB_USER_QUE}:${process.env.POSTGRES_DB_PASSWORD_QUE}@${process.env.POSTGRES_DB_HOST_QUE}:${process.env.POSTGRES_DB_PORT_QUE}/${process.env.POSTGRES_DB_NAME_QUE}`,
  );
}
bootstrap();
