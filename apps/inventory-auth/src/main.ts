import { NestFactory } from '@nestjs/core';
import { InventoryAuthModule } from './inventory-auth.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(InventoryAuthModule);

  //Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('inventory-auth')
    .setDescription('Api Inventory Auth')
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
  // app.setGlobalPrefix('auth/api');
  await app.startAllMicroservices();
  await app.listen(process.env.AUTH_PORT || 3003);

  //Console log
  const appUrl = await app.getUrl();
  const rabbitMQUrl = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:*****@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`;
  const dbUrl = `postgresql://${process.env.POSTGRES_DB_USER_QUE}:*****@${process.env.POSTGRES_DB_HOST_QUE}:${process.env.POSTGRES_DB_PORT_QUE}/${process.env.POSTGRES_DB_NAME_QUE}`;

  console.info(`

    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗

                        ░█████╗░██╗░░░██╗████████╗██╗░░██╗░░░░░░░█████╗░██████╗░██████╗░
                        ██╔══██╗██║░░░██║╚══██╔══╝██║░░██║░░░░░░██╔══██╗██╔══██╗██╔══██╗
                        ███████║██║░░░██║░░░██║░░░███████║█████╗███████║██████╔╝██████╔╝
                        ██╔══██║██║░░░██║░░░██║░░░██╔══██║╚════╝██╔══██║██╔═══╝░██╔═══╝░
                        ██║░░██║╚██████╔╝░░░██║░░░██║░░██║░░░░░░██║░░██║██║░░░░░██║░░░░░
                        ╚═╝░░╚═╝░╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝░░░░░░╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░
                        
    ╟──────────────────────────────────────────────────────────────────────────────────────────────────────────╢
    ║ URL:  ${appUrl}                                       
    ║                                                       
    ║ RMQ:  ${rabbitMQUrl}                                  
    ║                                                       
    ║ DB:   ${dbUrl}                                        
    ╚══════════════════════════════════════════════════════════════════════════════════════════════════════════╝

  `);
}
bootstrap();
