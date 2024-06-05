import { EventDomainModel, SeedUserDomainModel } from '@domain-models';
import {
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ISeedUserDomainCommand } from '@domain-commands';
import { IEventDomainService, IMailDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

export class SeedUserUseCase
  implements IUseCase<ISeedUserDomainCommand, SeedUserDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
    private readonly mailService: IMailDomainService,
  ) {}

  execute(
    registerUserCommand: ISeedUserDomainCommand,
  ): Observable<SeedUserDomainModel> {
    const newUser = this.entityFactory(registerUserCommand);
    const newEvent = this.eventFactory(newUser);
    if (newUser.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados [SeedUserUseCase]',
            newUser.getErrors(),
          ),
      );
    }
    return this.event$
      .entityAlreadyExist('email', registerUserCommand.email, [
        TypeNameEnum.USER_REGISTERED,
      ])
      .pipe(
        switchMap((exist: boolean) => {
          if (exist) {
            console.warn('Seed de usuario ya existe en la base de datos');
            return of(newUser);
          }
          return this.event$.storeEvent(newEvent).pipe(
            tap((event: EventDomainModel) => {
              this.notifyUser(registerUserCommand).subscribe();
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return newUser;
            }),
            map(() => {
              console.info('Seed de usuario almacenado en la base de datos');
              return newUser;
            }),
            catchError((err) =>
              throwError(() => new ConflictException(err.response.error)),
            ),
          );
        }),
      );
  }

  private entityFactory(
    registerUserCommand: ISeedUserDomainCommand,
  ): SeedUserDomainModel {
    const userData = new SeedUserDomainModel(
      registerUserCommand.fullName.firstName?.trim()?.toUpperCase() +
        ' ' +
        registerUserCommand.fullName.lastName?.trim()?.toUpperCase(),
      registerUserCommand.email,
      registerUserCommand.password,
      registerUserCommand.role,
    );
    return userData;
  }

  private eventFactory(user: SeedUserDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      'aggregateRootId',
      user,
      new Date(),
      TypeNameEnum.USER_REGISTERED,
    );
    return event;
  }

  private notifyUser(user: ISeedUserDomainCommand): Observable<string> {
    const subject = 'Bienvenido a ToolTraxPro';
    const body = `
      <body style="background-color: #f2f3f4; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; margin: 0; padding: 20px;">
        <p style="color: #1f618d; font-size: 18px;">¡Hola ${user.fullName.firstName},</p>
        <p style="color: #333;">Te damos la bienvenida a ToolTraxPro. Ahora puedes ingresar a la plataforma con tus datos de acceso:</p>
        <p><strong style="color: #1f618d;">Datos de Acceso:</strong></p>
        <p><strong style="color: #1f618d;">Correo Electrónico:</strong> ${user.email}</p>
        <p><strong style="color: #1f618d;">Contraseña:</strong> ${user.password}</p>
        <p style="color: #333;">Gracias por confiar en ToolTraxPro. Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.</p>
        <p style="color: #333;">Atentamente,<br>El Equipo de ToolTraxPro</p>
      </body>
    `;
    return this.mailService.sendEmail([user.email], subject, body);
  }
}
