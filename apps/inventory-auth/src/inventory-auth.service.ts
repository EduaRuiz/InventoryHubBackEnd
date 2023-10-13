import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}
