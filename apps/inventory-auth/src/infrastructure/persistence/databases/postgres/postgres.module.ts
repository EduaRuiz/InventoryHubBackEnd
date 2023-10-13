import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmPostgresConfigService } from './configs';
import { UserPostgresEntity } from './entities';
import { UserPostgresRepository } from './repositories';
import { UserPostgresService } from './services';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmPostgresConfigService,
    }),
    TypeOrmModule.forFeature([UserPostgresEntity]),
  ],
  controllers: [],
  providers: [
    TypeOrmPostgresConfigService,
    UserPostgresRepository,
    UserPostgresService,
  ],
  exports: [
    TypeOrmPostgresConfigService,
    UserPostgresRepository,
    UserPostgresService,
  ],
})
export class PostgresModule {}
