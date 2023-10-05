import { TypeNameEnum } from '@enums';

export class EventDomainModel {
  aggregateRootId: string;
  eventBody: object;
  occurredOn: Date;
  typeName: TypeNameEnum;

  constructor(
    aggregateRootId: string,
    eventBody: object,
    occurredOn: Date,
    typeName: TypeNameEnum,
  ) {
    this.aggregateRootId = aggregateRootId;
    this.eventBody = eventBody;
    this.occurredOn = occurredOn;
    this.typeName = typeName;
  }
}
