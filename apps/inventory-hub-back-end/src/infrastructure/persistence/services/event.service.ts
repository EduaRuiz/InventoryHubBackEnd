import { EventMongoService } from '../databases/mongo/services';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService extends EventMongoService {}
