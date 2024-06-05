import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { RabbitMQConfigService } from './rabbitmq.config.service';

describe('RabbitMQConfigService', () => {
  let service: RabbitMQConfigService;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Arrange
    mockConfigService = {
      get: jest.fn((key: string) => {
        return key === 'RMQ_URI' ? 'amqp://root:password@localhost:5672' : '';
      }),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQConfigService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    // Act
    service = module.get<RabbitMQConfigService>(RabbitMQConfigService);
  });

  it('should be defined', () => {
    // Assert
    expect(service).toBeDefined();
  });

  it('should return RabbitMQConfig with default URI when RMQ_URI is not provided', () => {
    // Act
    const config = service.getOptions();

    // Assert
    expect(config.uri).toEqual('amqp://root:password@localhost:5672');
  });

  it('should return RabbitMQConfig with custom URI when RMQ_URI is provided', () => {
    // Arrange
    mockConfigService.get.mockReturnValueOnce('custom_rabbitmq_uri');

    // Act
    const config = service.getOptions();

    // Assert
    expect(config.uri).toEqual('custom_rabbitmq_uri');
  });

  it('should return RabbitMQConfig with correct exchanges configuration', () => {
    // Act
    const config = service.getOptions();

    // Assert
    expect(config).toBeDefined(); // Asegura que config no sea nulo o indefinido

    // Comprueba si config.exchanges está definido antes de acceder a sus propiedades
    if (config.exchanges) {
      expect(config.exchanges.length).toEqual(1);
      expect(config.exchanges[0].name).toEqual('inventory_exchange');
      expect(config.exchanges[0].type).toEqual('topic');
      expect(config.exchanges[0].createExchangeIfNotExists).toEqual(true);
      expect(config.exchanges[0].options.durable).toEqual(true);
      expect(config.exchanges[0].options.autoDelete).toEqual(false);
      expect(config.exchanges[0].options.internal).toEqual(false);
    } else {
      fail('config.exchanges is not defined');
    }
  });
});
