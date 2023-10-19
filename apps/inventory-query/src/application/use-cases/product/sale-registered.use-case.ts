import {
  EventDomainModel,
  ProductDomainModel,
  SaleDomainModel,
} from '@domain-models';
import {
  IMailDomainService,
  IProductDomainService,
  ISaleDomainService,
  IUserDomainService,
} from '@domain-services';
import { UserRoleEnum } from '@enums';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import {
  Observable,
  catchError,
  forkJoin,
  map,
  mergeMap,
  of,
  switchMap,
  throwError,
} from 'rxjs';

export class SaleRegisteredUseCase
  implements IUseCase<EventDomainModel, SaleDomainModel>
{
  constructor(
    private readonly sale$: ISaleDomainService,
    private readonly product$: IProductDomainService,
    private readonly user$: IUserDomainService,
    private readonly notification$: IMailDomainService,
  ) {}
  execute(command: EventDomainModel): Observable<SaleDomainModel> {
    const saleRegistered = command.eventBody as SaleDomainModel;
    const newSale = this.entityFactory(saleRegistered);
    if (newSale.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newSale.getErrors(),
          ),
      );
    }
    return this.sale$.createSale(newSale).pipe(
      switchMap((sale) => {
        return this.notify(sale.branchId, sale);
      }),
    );
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
    return saleData;
  }

  private productsBefore(
    sale: SaleDomainModel,
  ): Observable<
    { productBefore: ProductDomainModel; currentQuantity: number }[]
  > {
    const productObservables = sale.products.map((product) =>
      this.product$.getProductByName(product.name, sale.branchId).pipe(
        map((productOnDate: ProductDomainModel) => {
          return {
            productBefore: {
              ...productOnDate,
              quantity: productOnDate.quantity + product.quantity,
            } as ProductDomainModel,
            currentQuantity: productOnDate.quantity,
          };
        }),
      ),
    );
    return forkJoin(productObservables);
  }

  private notify(
    branchId: string,
    sale: SaleDomainModel,
  ): Observable<SaleDomainModel> {
    return this.productsBefore(sale).pipe(
      mergeMap(
        (
          productsBefore: {
            productBefore: ProductDomainModel;
            currentQuantity: number;
          }[],
        ) => {
          const productsInNotification = productsBefore.filter(
            (product) =>
              product.productBefore.quantity > 5 && product.currentQuantity < 5,
          );
          if (productsInNotification.length > 0) {
            return this.user$
              .getAllUsersByBranchIdAndRol(branchId, UserRoleEnum.ADMIN)
              .pipe(
                mergeMap((users) => {
                  const emails = users.map((user) => user.email);
                  if (emails.length === 0) {
                    return of(sale);
                  }
                  const body = `
                  <body style="background-color: #f2f3f4; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
                  <p style="color: #1f618d; font-size: 18px;">Estimado usuario,</p>                  
                  <p style="color: #333;">Le informamos que algunos productos en su inventario tienen una cantidad inferior a 5 unidades. Asegúrese de reponer el stock de los siguientes productos:</p>
                  <ul style="list-style-type: none; padding: 0; margin: 0;">
                    ${productsInNotification
                      .map(
                        (producto) =>
                          `<li style="color: #1f618d; font-size: 16px;">&#8226; ${producto.productBefore.name} - Cantidad actual: ${producto.currentQuantity}</li>`,
                      )
                      .join('')}
                  </ul>
                  
                  <p><strong style="color: #1f618d; font-size: 18px;">Detalles de la factura:</strong></p>
                  <p><strong style="color: #1f618d;">Número de Factura:</strong> ${
                    sale.number
                  }</p>
                  <p><strong style="color: #1f618d;">Fecha de Creación:</strong> ${
                    sale.date
                  }</p>                  
                  <p style="color: #333;">Gracias por su atención.</p>                  
                  <p style="color: #333;">Atentamente,<br>Su Empresa</p>                  
                  </body>
                  
                `;
                  return this.notification$
                    .sendEmail(emails, 'Stock de productos agotándose', body)
                    .pipe(
                      map(() => sale),
                      catchError((error) => {
                        console.error(
                          'Error al enviar el correo electrónico:',
                          error,
                        );
                        // Manejar el error de enviar el correo electrónico si es necesario
                        return throwError(() => error);
                      }),
                    );
                }),
              );
          } else {
            return of(sale);
          }
        },
      ),
      catchError((error) => {
        console.error('Error en la notificación:', error);
        // Manejar otros errores si es necesario
        return throwError(() => error);
      }),
    );
  }
}
