import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

/**
 * Configuración de conexión a base de datos MongoDB
 *
 * @export
 * @class MongooseConfigService
 * @implements {MongooseOptionsFactory}
 */
@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  /**
   * Crea una instancia de MongooseConfigService
   *
   * @param {ConfigService} configService Servicio de configuración
   * @memberof MongooseConfigService
   */
  constructor(private readonly configService: ConfigService) {}

  /**
   * Crea las opciones de conexión a base de datos MongoDB
   *
   * @return  {MongooseModuleOptions} Opciones de conexión a base de datos MongoDB
   * @memberof MongooseConfigService
   */
  createMongooseOptions(): MongooseModuleOptions {
    const user = this.configService.get<string>('MONGO_DB_USER');
    const password = this.configService.get<string>('MONGO_DB_PASSWORD');
    const host = this.configService.get<string>('MONGO_DB_HOST');
    const port = this.configService.get<number>('MONGO_DB_PORT');
    const dbName = this.configService.get<string>('MONGO_DB_NAME');
    const authSource = this.configService.get<string>('MONGO_DB_AUTH_SOURCE');
    const uri = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=${authSource}`;
    return { uri, dbName };
  }
}
