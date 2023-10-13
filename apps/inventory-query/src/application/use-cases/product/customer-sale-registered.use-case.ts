import { EventDomainModel, SaleDomainModel } from '@domain-models';
import { ISaleDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';

export class CustomerSaleRegisteredUseCase
  implements IUseCase<EventDomainModel, SaleDomainModel>
{
  constructor(private readonly sale$: ISaleDomainService) {}
  execute(command: EventDomainModel): Observable<SaleDomainModel> {
    const saleRegistered = command.eventBody as SaleDomainModel;
    const newSale = this.entityFactory(saleRegistered);
    return this.sale$.createSale(newSale);
  }

  private entityFactory(saleRegistered: SaleDomainModel): SaleDomainModel {
    const saleData = new SaleDomainModel(
      saleRegistered.number,
      saleRegistered.products,
      saleRegistered.date,
      saleRegistered.type,
      saleRegistered.total,
      saleRegistered.branchId,
      saleRegistered.userId,
      saleRegistered.id,
    );
    if (saleData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados en la venta',
        saleData.getErrors(),
      );
    }
    return saleData;
  }
}
