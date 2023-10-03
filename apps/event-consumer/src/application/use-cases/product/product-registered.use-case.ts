import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class ProductRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    console.log('ProductRegisteredUseCase', JSON.parse(command.eventBody));
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
