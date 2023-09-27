import { EventPublisherBase } from '@sofka/bases';
import { ProductDomainModel } from '@domain-models';
import { Topic } from './enums/topic.enum';

export abstract class ProductPurchaseRegisteredEventPublisher<
  Response = ProductDomainModel,
> extends EventPublisherBase<Response> {
  publish<Result = any>(): Promise<Result> {
    return this.emit(
      Topic.PRODUCT_PURCHASE_REGISTERED,
      JSON.stringify(this.response),
    );
  }
}
