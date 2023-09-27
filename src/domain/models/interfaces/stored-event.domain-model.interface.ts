export interface IStoredEventDomainModel {
  aggregateRootId: string;
  eventBody: string;
  occurredOn: Date;
  typeName: string;
}
