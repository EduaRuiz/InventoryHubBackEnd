import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';

@Schema({ collection: 'event', versionKey: false })
export class StoreEventMongoModel extends EventDomainModel {
  _id?: string;

  @Prop({
    required: true,
    type: String,
  })
  aggregateRootId: string;

  @Prop({
    required: true,
    type: Object,
  })
  eventBody: object;

  @Prop({
    required: true,
    type: Date,
  })
  occurredOn: Date;

  @Prop({
    required: true,
    type: String,
  })
  typeName: TypeNameEnum;
}

export const StoredEventSchema =
  SchemaFactory.createForClass(StoreEventMongoModel);
export type StoredEventDocument = HydratedDocument<StoreEventMongoModel>;
