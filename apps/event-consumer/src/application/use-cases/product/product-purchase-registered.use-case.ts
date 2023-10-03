import { EventDomainModel, ProductDomainModel } from '@domain-models';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class ProductPurchaseRegisteredUseCase
  implements IUseCase<EventDomainModel, ProductDomainModel>
{
  execute(command: EventDomainModel): Observable<ProductDomainModel> {
    console.log(
      'ProductPurchaseRegisteredUseCase',
      JSON.parse(command.eventBody),
    );
    return new Observable((subscriber) => {
      subscriber.next(JSON.parse(command.eventBody));
    });
  }
}
