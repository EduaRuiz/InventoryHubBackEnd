import { EventDomainModel, UserDomainModel } from '@domain-models';
import { Observable, catchError, map, switchMap } from 'rxjs';
import { INewUserDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

export class UserRegisterUseCase
  implements IUseCase<INewUserDomainCommand, UserDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    registerUserCommand: INewUserDomainCommand,
  ): Observable<UserDomainModel> {
    const newUser = this.entityFactory(registerUserCommand);
    const newEvent = this.eventFactory(newUser);
    return this.event$
      .entityAlreadyExist(
        'email',
        registerUserCommand.email,
        registerUserCommand.branchId,
      )
      .pipe(
        switchMap((exist: boolean) => {
          if (exist)
            throw new ConflictException(
              'El correo electrónico ya existe en la sucursal actual',
            );
          return this.event$
            .getLastEventByEntityId(newUser.branchId, [
              TypeNameEnum.BRANCH_REGISTERED,
            ])
            .pipe(
              switchMap(() => {
                return this.event$.storeEvent(newEvent).pipe(
                  map((event: EventDomainModel) => {
                    this.eventPublisher.response = event;
                    this.eventPublisher.publish();
                    return newUser;
                  }),
                );
              }),
              catchError(() => {
                throw new ConflictException('La sucursal no existe');
              }),
            );
        }),
      );
  }

  private entityFactory(
    registerUserCommand: INewUserDomainCommand,
  ): UserDomainModel {
    const userData = new UserDomainModel(
      registerUserCommand.fullName.firstName?.trim()?.toUpperCase() +
        ' ' +
        registerUserCommand.fullName.lastName?.trim()?.toUpperCase(),
      registerUserCommand.email,
      registerUserCommand.password,
      registerUserCommand.role,
      registerUserCommand.branchId,
    );
    if (userData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        userData.getErrors(),
      );
    }
    return userData;
  }

  private eventFactory(user: UserDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      user.branchId,
      user,
      new Date(),
      TypeNameEnum.USER_REGISTERED,
    );
    return event;
  }
}
