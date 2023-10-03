import { StoreEventMongoService } from '../databases/mongo/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreEventService extends StoreEventMongoService {}
