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
      host: this.configService.get<string>('POSTGRES_DB_HOST'),
      port: this.configService.get<number>('POSTGRES_DB_PORT'),
      username: this.configService.get<string>('POSTGRES_DB_USER'),
      password: this.configService.get<string>('POSTGRES_DB_PASSWORD'),
      database: this.configService.get<string>('POSTGRES_DB_NAME'),
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
