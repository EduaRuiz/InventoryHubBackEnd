import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPostgresConfigService } from './configs';
import {
  UserPostgresEntity,
  ProductPostgresEntity,
  BranchPostgresEntity,
} from './entities';
import {
  UserPostgresRepository,
  ProductPostgresRepository,
  BranchPostgresRepository,
} from './repositories';
import {
  UserPostgresService,
  ProductPostgresService,
  BranchPostgresService,
} from './services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmPostgresConfigService,
    }),
    TypeOrmModule.forFeature([
      ProductPostgresEntity,
      UserPostgresEntity,
      BranchPostgresEntity,
    ]),
  ],
  controllers: [],
  providers: [
    TypeOrmPostgresConfigService,
    ProductPostgresRepository,
    UserPostgresRepository,
    BranchPostgresRepository,
    ProductPostgresService,
    UserPostgresService,
    BranchPostgresService,
  ],
  exports: [
    ProductPostgresRepository,
    UserPostgresRepository,
    BranchPostgresRepository,
    ProductPostgresService,
    UserPostgresService,
    BranchPostgresService,
  ],
})
export class PostgresModule {}
