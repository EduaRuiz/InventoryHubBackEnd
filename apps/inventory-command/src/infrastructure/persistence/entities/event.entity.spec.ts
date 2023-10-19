import { TypeNameEnum } from '@domain';
import { StoreEventMongoModel } from '../databases/mongo/models';

describe('EventEntity', () => {
  it('should be defined', () => {
    // Arrange
    const storeEventMongoModel = new StoreEventMongoModel(
      '1',
      {},
      new Date(),
      TypeNameEnum.PRODUCT_REGISTERED,
    );

    expect(storeEventMongoModel).toBeDefined();
  });
});
