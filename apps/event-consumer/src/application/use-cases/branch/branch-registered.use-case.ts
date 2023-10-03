import { EventDomainModel, BranchDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class BranchRegisteredUseCase
  implements IUseCase<EventDomainModel, BranchDomainModel>
{
  execute(command: EventDomainModel): Observable<BranchDomainModel> {
    console.log('BranchRegisteredUseCase', JSON.parse(command.eventBody));
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
