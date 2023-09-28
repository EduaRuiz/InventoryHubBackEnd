import { EventPublisherBase } from '@sofka/bases';
import { ProductDomainModel } from '@domain-models';

export abstract class CustomerSaleRegisteredEventPublisher<
  Response = ProductDomainModel,
> extends EventPublisherBase<Response> {}
