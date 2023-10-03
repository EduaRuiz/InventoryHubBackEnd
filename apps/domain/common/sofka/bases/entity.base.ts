import { v4 as UUIDv4 } from 'uuid';

export abstract class EntityBase {
  id: string;
  constructor(value?: string) {
    if (value) this.id = value;
    else this.id = UUIDv4();
  }
}
