import { EventPublisherBase } from '@sofka/bases';
import { ProductDomainModel } from '@domain-models';

export abstract class ProductRegisteredEventPublisher<
  Response = ProductDomainModel,
> extends EventPublisherBase<Response> {}
