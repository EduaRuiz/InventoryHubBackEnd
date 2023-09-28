import { EventPublisherBase } from '@sofka/bases';
import { UserDomainModel } from '@domain-models';

export abstract class UserRegisteredEventPublisher<
  Response = UserDomainModel,
> extends EventPublisherBase<Response> {}
