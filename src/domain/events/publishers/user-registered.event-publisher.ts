import { EventPublisherBase } from '@sofka/bases';
import { UserDomainModel } from '@domain-models';
import { Topic } from './enums/topic.enum';

export abstract class UserRegisteredEventPublisher<
  Response = UserDomainModel,
> extends EventPublisherBase<Response> {
  publish<Result = any>(): Promise<Result> {
    return this.emit(Topic.USER_REGISTERED, JSON.stringify(this.response));
  }
}
