import { Controller, Get } from '@nestjs/common';
import { InventoryAuthService } from './inventory-auth.service';

@Controller()
export class InventoryAuthController {
  constructor(private readonly inventoryAuthService: InventoryAuthService) {}

  @Get()
  getHello(): string {
    return this.inventoryAuthService.getHello();
  }
}
