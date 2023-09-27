import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StoredEventDomainModel } from '@domain-models';

@Schema({ collection: 'stored-event', versionKey: false })
export class StoredEventMongoModel extends StoredEventDomainModel {
  constructor(
    aggregateRootId: string,
    eventBody: string,
    occurredOn: Date,
    typeName: string,
  ) {
    super();
    this._id = undefined;
    this.aggregateRootId = aggregateRootId;
    this.eventBody = eventBody;
    this.occurredOn = occurredOn;
    this.typeName = typeName;
  }

  _id?: string;

  @Prop({
    required: true,
    type: String,
  })
  aggregateRootId: string;

  @Prop({
    required: true,
    type: String,
  })
  eventBody: string;

  @Prop({
    required: true,
    type: Date,
  })
  occurredOn: Date;

  @Prop({
    required: true,
    type: String,
  })
  typeName: string;
}

export const StoredEventSchema = SchemaFactory.createForClass(
  StoredEventMongoModel,
);
export type StoredEventDocument = HydratedDocument<StoredEventMongoModel>;
