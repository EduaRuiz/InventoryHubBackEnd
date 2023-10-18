import { ProductDomainModel } from '@domain-models';
import { DomainEventPublisher } from '@domain-publishers';
import { IEventDomainService } from '@domain-services';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import {
  CustomerSaleRegisterUseCase,
  ProductPurchaseRegisterUseCase,
  ProductRegisterUseCase,
  SellerSaleRegisterUseCase,
} from '.';

export class ProductDelegator
  implements IUseCase<any, ProductDomainModel | ProductDomainModel[]>
{
  private delegate: IUseCase<any, any>;

  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute<Response>(...args: any[]): Observable<Response> {
    return this.delegate.execute(...args);
  }

  toProductRegisterUseCase(): void {
    this.delegate = new ProductRegisterUseCase(
      this.event$,
      this.eventPublisher,
    );
  }

  toProductPurchaseRegisterUseCase(): void {
    this.delegate = new ProductPurchaseRegisterUseCase(
      this.event$,
      this.eventPublisher,
    );
  }

  toSellerSaleUseCase(): void {
    this.delegate = new SellerSaleRegisterUseCase(
      this.event$,
      this.eventPublisher,
    );
  }

  toCustomerSaleUseCase(): void {
    this.delegate = new CustomerSaleRegisterUseCase(
      this.event$,
      this.eventPublisher,
    );
  }
}
