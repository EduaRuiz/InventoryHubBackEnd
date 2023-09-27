// import { Test } from '@nestjs/testing';
// import { ConfigService } from '@nestjs/config';
// import { MongooseConfigService } from './mongoose-config.service';

// describe('MongooseConfigService', () => {
//   let service: MongooseConfigService;
//   let mockConfigService: jest.Mocked<ConfigService>;

//   beforeEach(async () => {
//     mockConfigService = {
//       get: jest.fn((key: string) => {
//         if (key === 'MONGO_DB_URI_INVENTORY') {
//           return 'mongodb://localhost:27017';
//         } else if (key === 'MONGO_DB_NAME_INVENTORY') {
//           return 'test-db';
//         }
//       }),
//     } as unknown as jest.Mocked<ConfigService>;

//     const moduleRef = await Test.createTestingModule({
//       providers: [
//         MongooseConfigService,
//         {
//           provide: ConfigService,
//           useValue: mockConfigService,
//         },
//       ],
//     }).compile();

//     service = moduleRef.get<MongooseConfigService>(MongooseConfigService);
//   });

//   it('should create an instance of MongooseConfigService', () => {
//     expect(service).toBeInstanceOf(MongooseConfigService);
//   });

//   it('should return the correct mongoose options', () => {
//     const options = service.createMongooseOptions();
//     // expect(options.uri).toEqual('mongodb://localhost:27017');
//     expect(options.dbName).toEqual('test-db');
//   });
// });
