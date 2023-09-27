import { StoredEventMongoService } from '../databases/mongo/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoredEventService extends StoredEventMongoService {}
