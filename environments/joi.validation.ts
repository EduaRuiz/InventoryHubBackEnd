import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  // # accesos genéricos a mongo servicio inventory-command
  MONGO_DB_HOST: Joi.string().default('localhost'),
  MONGO_DB_PORT: Joi.number().default(27017),
  MONGO_DB_USER: Joi.string().default('root'),
  MONGO_DB_PASSWORD: Joi.string().default('password'),
  MONGO_DB_NAME: Joi.string().default('inventory'),
  MONGO_DB_URI: Joi.string().default('mongodb://root:password@localhost:27017'),
  MONGO_DB_AUTH_SOURCE: Joi.string().default('admin'),
  // # accesos genéricos a postgres servicio inventory-query
  POSTGRES_DB_HOST: Joi.string().default('localhost'),
  POSTGRES_DB_PORT: Joi.number().default(5432),
  POSTGRES_DB_USER: Joi.string().default('root'),
  POSTGRES_DB_PASSWORD: Joi.string().default('password'),
  POSTGRES_DB_NAME: Joi.string().default('inventory'),
  POSTGRES_DB_URI: Joi.string().default(
    'postgresql://root:password@localhost:5432/inventory',
  ),
  // # accesos genéricos a postgres servicio inventory-auth
  POSTGRES_DB_HOST_AUTH: Joi.string().default('localhost'),
  POSTGRES_DB_PORT_AUTH: Joi.number().default(5432),
  POSTGRES_DB_USER_AUTH: Joi.string().default('root'),
  POSTGRES_DB_PASSWORD_AUTH: Joi.string().default('password'),
  POSTGRES_DB_NAME_AUTH: Joi.string().default('auth'),
  POSTGRES_DB_URI_AUTH: Joi.string().default(
    'postgresql://root:password@localhost:5432/auth',
  ),
  // # accesos genéricos a rabbitMQ todos los servicios
  RABBITMQ_DEFAULT_HOST: Joi.string().default('localhost'),
  RABBITMQ_DEFAULT_PORT: Joi.number().default(5672),
  RABBITMQ_DEFAULT_USER: Joi.string().default('root'),
  RABBITMQ_DEFAULT_PASS: Joi.string().default('password'),
  RMQ_URI: Joi.string().default('amqp://root:password@localhost:5672'),

  // # puertos de los microservicios
  COMMAND_PORT: Joi.number().default(3000),
  PROXY_PORT: Joi.number().default(3002),
  QUERY_PORT: Joi.number().default(3001),
  AUTH_PORT: Joi.number().default(3003),

  // # secret para JWT
  JWT_SECRET: Joi.string().default('secret'),
});
