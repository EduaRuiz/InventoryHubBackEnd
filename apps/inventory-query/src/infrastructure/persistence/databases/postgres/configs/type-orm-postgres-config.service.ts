import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import {
  ProductPostgresEntity,
  BranchPostgresEntity,
  UserPostgresEntity,
  SalePostgresEntity,
  SaleProductPostgresEntity,
} from '../entities';

@Injectable()
export class TypeOrmPostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_DB_HOST_QUE'),
      port: this.configService.get<number>('POSTGRES_DB_PORT_QUE'),
      username: this.configService.get<string>('POSTGRES_DB_USER_QUE'),
      password: this.configService.get<string>('POSTGRES_DB_PASSWORD_QUE'),
      database: this.configService.get<string>('POSTGRES_DB_NAME_QUE'),
      // host: 'localhost',
      // port: 5432,
      // username: 'root',
      // password: 'password',
      // database: 'inventory',
      entities: [
        ProductPostgresEntity,
        BranchPostgresEntity,
        UserPostgresEntity,
        SalePostgresEntity,
        SaleProductPostgresEntity,
      ],
      synchronize: true,
      logging: true,
    };
  }
}
