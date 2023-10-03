import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class CustomerSaleRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    console.log('CustomerSaleRegisteredUseCase', JSON.parse(command.eventBody));
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
