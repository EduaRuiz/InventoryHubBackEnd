import { ProductDomainModel } from '@domain-models/product.domain-model';
import { ProductRegisteredEventPublisher } from '@domain-publishers/index';
import { IProductDomainService } from '@domain-services/index';
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
    private readonly product$: IProductDomainService,
    private readonly productRegisteredEventPublisher: ProductRegisteredEventPublisher,
    private readonly productPurchaseRegisteredEventPublisher: ProductRegisteredEventPublisher,
    private readonly sellerSaleRegisteredEventPublisher: ProductRegisteredEventPublisher,
    private readonly customerSaleRegisteredEventPublisher: ProductRegisteredEventPublisher,
  ) {}

  execute<Response>(...args: any[]): Observable<Response> {
    return this.delegate.execute(...args);
  }

  toProductRegisterUseCase(): void {
    this.delegate = new ProductRegisterUseCase(
      this.product$,
      this.productRegisteredEventPublisher,
    );
  }

  toProductPurchaseRegisterUseCase(): void {
    this.delegate = new ProductPurchaseRegisterUseCase(
      this.product$,
      this.productPurchaseRegisteredEventPublisher,
    );
  }

  toSellerSaleUseCase(): void {
    this.delegate = new SellerSaleRegisterUseCase(
      this.product$,
      this.sellerSaleRegisteredEventPublisher,
    );
  }

  toCustomerSaleUseCase(): void {
    this.delegate = new CustomerSaleRegisterUseCase(
      this.product$,
      this.customerSaleRegisteredEventPublisher,
    );
  }
}
