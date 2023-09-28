import { EventPublisherBase } from '@sofka/bases';
import { ProductDomainModel } from '@domain-models';

export abstract class ProductPurchaseRegisteredEventPublisher<
  Response = ProductDomainModel,
> extends EventPublisherBase<Response> {}
