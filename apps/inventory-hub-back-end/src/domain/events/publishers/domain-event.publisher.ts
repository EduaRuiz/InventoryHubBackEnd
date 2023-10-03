import { EventPublisherBase } from '@sofka/bases';
import { EventDomainModel } from '@domain-models';

export abstract class DomainEventPublisher<
  Response = EventDomainModel,
> extends EventPublisherBase<Response> {}
