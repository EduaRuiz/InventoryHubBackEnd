import { EventDomainModel, UserDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class UserRegisteredUseCase
  implements IUseCase<EventDomainModel, UserDomainModel>
{
  execute(command: EventDomainModel): Observable<UserDomainModel> {
    console.log('UserRegisteredUseCase', JSON.parse(command.eventBody));
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
