import { Test, TestingModule } from '@nestjs/testing';
import { InventoryAuthController } from './inventory-auth.controller';
import { InventoryAuthService } from './inventory-auth.service';

describe('InventoryAuthController', () => {
  let inventoryAuthController: InventoryAuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InventoryAuthController],
      providers: [InventoryAuthService],
    }).compile();

    inventoryAuthController = app.get<InventoryAuthController>(InventoryAuthController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(inventoryAuthController.getHello()).toBe('Hello World!');
    });
  });
});
