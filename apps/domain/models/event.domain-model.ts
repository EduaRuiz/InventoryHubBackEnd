export class EventDomainModel {
  aggregateRootId: string;
  eventBody: string;
  occurredOn: Date;
  typeName: string;

  constructor(
    aggregateRootId: string,
    eventBody: string,
    occurredOn: Date,
    typeName: string,
  ) {
    this.aggregateRootId = aggregateRootId;
    this.eventBody = eventBody;
    this.occurredOn = occurredOn;
    this.typeName = typeName;
  }
}
