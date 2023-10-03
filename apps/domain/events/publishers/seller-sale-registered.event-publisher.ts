import { EventPublisherBase } from '@sofka/bases';
import { ProductDomainModel } from '@domain-models';

export abstract class SellerSaleRegisteredEventPublisher<
  Response = ProductDomainModel,
> extends EventPublisherBase<Response> {}
