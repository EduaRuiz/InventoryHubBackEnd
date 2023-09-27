import { EventPublisherBase } from '@sofka/bases';
import { BranchDomainModel } from '@domain-models';
import { Topic } from './enums/topic.enum';

export abstract class BranchRegisteredEventPublisher<
  Response = BranchDomainModel,
> extends EventPublisherBase<Response> {
  publish<Result = any>(): Promise<Result> {
    return this.emit(Topic.BRANCH_REGISTERED, JSON.stringify(this.response));
  }
}
