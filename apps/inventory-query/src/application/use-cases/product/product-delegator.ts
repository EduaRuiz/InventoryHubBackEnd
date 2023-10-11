import { ProductDomainModel } from '@domain-models/product.domain-model';
import {
  IProductDomainService,
  ISaleDomainService,
} from '@domain-services/index';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import {
  CustomerSaleRegisteredUseCase,
  ProductPurchaseRegisteredUseCase,
  ProductRegisteredUseCase,
  SellerSaleRegisteredUseCase,
} from '.';

export class ProductDelegator
  implements IUseCase<any, ProductDomainModel | ProductDomainModel[]>
{
  private delegate: IUseCase<any, any>;

  constructor(
    private readonly product$: IProductDomainService,
    private readonly sale$: ISaleDomainService,
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
    this.delegate = new SellerSaleRegisteredUseCase(this.sale$);
  }

  toCustomerSaleUseCase(): void {
    this.delegate = new CustomerSaleRegisteredUseCase(this.sale$);
  }
}
