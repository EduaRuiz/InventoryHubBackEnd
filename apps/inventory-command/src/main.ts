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
  const appUrl = await app.getUrl();
  const rabbitMQUrl = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:******@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`;
  const dbUrl = `mongodb://${process.env.MONGO_DB_USER}:*****@${process.env.MONGO_DB_HOST}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`;

  console.info(`

    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗

            ░█████╗░░█████╗░███╗░░░███╗███╗░░░███╗░█████╗░███╗░░██╗██████╗░░░░░░░░█████╗░██████╗░██████╗░
            ██╔══██╗██╔══██╗████╗░████║████╗░████║██╔══██╗████╗░██║██╔══██╗░░░░░░██╔══██╗██╔══██╗██╔══██╗
            ██║░░╚═╝██║░░██║██╔████╔██║██╔████╔██║███████║██╔██╗██║██║░░██║█████╗███████║██████╔╝██████╔╝
            ██║░░██╗██║░░██║██║╚██╔╝██║██║╚██╔╝██║██╔══██║██║╚████║██║░░██║╚════╝██╔══██║██╔═══╝░██╔═══╝░
            ╚█████╔╝╚█████╔╝██║░╚═╝░██║██║░╚═╝░██║██║░░██║██║░╚███║██████╔╝░░░░░░██║░░██║██║░░░░░██║░░░░░
            ░╚════╝░░╚════╝░╚═╝░░░░░╚═╝╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝╚═════╝░░░░░░░╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░
            
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
