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
    console.log('MONGO_DB_URI', this.configService.get<string>('MONGO_DB_URI'));
    return {
      uri: this.configService.get<string>('MONGO_DB_URI'),
      dbName: this.configService.get<string>('MONGO_DB_NAME'),
    };
  }
}
