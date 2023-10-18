import { ProductDomainModel } from '@domain-models';
import {
  IMailDomainService,
  IProductDomainService,
  ISaleDomainService,
  IUserDomainService,
} from '@domain-services';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import {
  SaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
} from '.';

export class ProductDelegator
  implements IUseCase<any, ProductDomainModel | ProductDomainModel[]>
{
  private delegate: IUseCase<any, any>;

  constructor(
    private readonly product$: IProductDomainService,
    private readonly sale$: ISaleDomainService,
    private readonly user$: IUserDomainService,
    private readonly notification$: IMailDomainService,
  ) {}

  execute<Response>(...args: any[]): Observable<Response> {
    return this.delegate.execute(...args);
  }

  toProductRegisteredUseCase(): void {
    this.delegate = new ProductRegisteredUseCase(this.product$);
  }

  toProductPurchaseRegisteredUseCase(): void {
    this.delegate = new ProductPurchaseRegisteredUseCase(this.product$);
  }

  toSellerSaleUseCase(): void {
    this.delegate = new SaleRegisteredUseCase(
      this.sale$,
      this.product$,
      this.user$,
      this.notification$,
    );
  }

  toCustomerSaleUseCase(): void {
    this.delegate = new SaleRegisteredUseCase(
      this.sale$,
      this.product$,
      this.user$,
      this.notification$,
    );
  }
}
