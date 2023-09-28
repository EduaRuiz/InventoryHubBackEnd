import { EventPublisherBase } from '@sofka/bases';
import { BranchDomainModel } from '@domain-models';

export abstract class BranchRegisteredEventPublisher<
  Response = BranchDomainModel,
> extends EventPublisherBase<Response> {}
