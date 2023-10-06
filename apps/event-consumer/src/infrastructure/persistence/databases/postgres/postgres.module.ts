import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPostgresConfigService } from './configs';
import {
  UserPostgresEntity,
  ProductPostgresEntity,
  BranchPostgresEntity,
  SalePostgresEntity,
  SaleProductPostgresEntity,
} from './entities';
import {
  UserPostgresRepository,
  ProductPostgresRepository,
  BranchPostgresRepository,
  SalePostgresRepository,
  SaleProductPostgresRepository,
} from './repositories';
import {
  UserPostgresService,
  ProductPostgresService,
  BranchPostgresService,
  SalePostgresService,
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
      SalePostgresEntity,
      SaleProductPostgresEntity,
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
    SalePostgresRepository,
    SalePostgresService,
    SaleProductPostgresRepository,
  ],
  exports: [
    TypeOrmPostgresConfigService,
    ProductPostgresRepository,
    UserPostgresRepository,
    BranchPostgresRepository,
    ProductPostgresService,
    UserPostgresService,
    BranchPostgresService,
    SalePostgresRepository,
    SalePostgresService,
    SaleProductPostgresRepository,
  ],
})
export class PostgresModule {}
