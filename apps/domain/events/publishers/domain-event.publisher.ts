import { EventDomainModel } from '@domain-models';
import { Observable } from 'rxjs';

export abstract class DomainEventPublisher<Response = EventDomainModel> {
  response: Response;
  abstract publish<Result = any>(): Observable<Result>;
}
