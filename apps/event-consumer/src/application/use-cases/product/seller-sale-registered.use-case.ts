import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class SellerSaleRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    console.log('SellerSaleRegisteredUseCase', JSON.parse(command.eventBody));
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
