import { IStoredEventDomainModel } from './interfaces';

export class StoredEventDomainModel implements IStoredEventDomainModel {
  aggregateRootId: string;
  eventBody: string;
  occurredOn: Date;
  typeName: string;
}
