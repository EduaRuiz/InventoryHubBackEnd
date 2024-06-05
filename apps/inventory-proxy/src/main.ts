import { NestFactory } from '@nestjs/core';
import { InventoryProxyModule } from './inventory-proxy.module';
import { ValidationPipe } from '@nestjs/common';
import { ValueObjectExceptionFilter } from 'apps/inventory-command/src/infrastructure/utils';

async function bootstrap() {
  const app = await NestFactory.create(InventoryProxyModule);

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
  await app.listen(process.env.PROXY_PORT || 3002);

  //Console log
  const appUrl = await app.getUrl();
  const rabbitMQUrl = `amqp://${process.env.RABBITMQ_DEFAULT_USER}:*****@${process.env.RABBITMQ_DEFAULT_HOST}:${process.env.RABBITMQ_DEFAULT_PORT}`;
  const dbUrl = `postgresql://${process.env.POSTGRES_DB_USER_QUE}:*****@${process.env.POSTGRES_DB_HOST_QUE}:${process.env.POSTGRES_DB_PORT_QUE}/${process.env.POSTGRES_DB_NAME_QUE}`;

  console.info(`

    ╔══════════════════════════════════════════════════════════════════════════════════════════════════════════╗

                    ██████╗░██████╗░░█████╗░██╗░░██╗██╗░░░██╗░░░░░░░█████╗░██████╗░██████╗░
                    ██╔══██╗██╔══██╗██╔══██╗╚██╗██╔╝╚██╗░██╔╝░░░░░░██╔══██╗██╔══██╗██╔══██╗
                    ██████╔╝██████╔╝██║░░██║░╚███╔╝░░╚████╔╝░█████╗███████║██████╔╝██████╔╝
                    ██╔═══╝░██╔══██╗██║░░██║░██╔██╗░░░╚██╔╝░░╚════╝██╔══██║██╔═══╝░██╔═══╝░
                    ██║░░░░░██║░░██║╚█████╔╝██╔╝╚██╗░░░██║░░░░░░░░░██║░░██║██║░░░░░██║░░░░░
                    ╚═╝░░░░░╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝░░░╚═╝░░░░░░░░░╚═╝░░╚═╝╚═╝░░░░░╚═╝░░░░░
                    
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
