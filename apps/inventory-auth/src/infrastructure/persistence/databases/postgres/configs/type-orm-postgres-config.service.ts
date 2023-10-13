import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { UserPostgresEntity } from '../entities/user-postgres.entity';

@Injectable()
export class TypeOrmPostgresConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('POSTGRES_DB_HOST_AUTH'),
      port: this.configService.get<number>('POSTGRES_DB_PORT_AUTH'),
      username: this.configService.get<string>('POSTGRES_DB_USER_AUTH'),
      password: this.configService.get<string>('POSTGRES_DB_PASSWORD_AUTH'),
      database: this.configService.get<string>('POSTGRES_DB_NAME_AUTH'),
      entities: [UserPostgresEntity],
      synchronize: true,
      logging: true,
    };
  }
}
