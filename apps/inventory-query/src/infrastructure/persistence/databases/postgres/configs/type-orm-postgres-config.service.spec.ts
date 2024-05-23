import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypeOrmPostgresConfigService } from './type-orm-postgres-config.service';

describe('TypeOrmPostgresConfigService', () => {
  let service: TypeOrmPostgresConfigService;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Arrange
    mockConfigService = {
      get: jest.fn((key: string) => {
        return key === 'POSTGRES_DB_HOST'
          ? 'localhost'
          : key === 'POSTGRES_DB_PORT'
            ? 5432
            : key === 'POSTGRES_DB_USER'
              ? 'user'
              : key === 'POSTGRES_DB_PASSWORD'
                ? 'password'
                : key === 'POSTGRES_DB_NAME'
                  ? 'dbname'
                  : '';
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmPostgresConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<TypeOrmPostgresConfigService>(
      TypeOrmPostgresConfigService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create TypeOrm options', () => {
    const options: TypeOrmModuleOptions = service.createTypeOrmOptions();
    expect(options.type).toEqual('postgres');
    expect(options.database).toEqual('dbname');
    expect(options.synchronize).toEqual(true);
    expect(options.logging).toEqual(true);
  });
});
