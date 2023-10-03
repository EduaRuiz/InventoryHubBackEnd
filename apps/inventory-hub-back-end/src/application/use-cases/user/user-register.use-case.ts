import { EventDomainModel, UserDomainModel } from '@domain-models';
import { Observable, of, switchMap } from 'rxjs';
import { INewUserDomainCommand } from '@domain-commands';
import { IStoreEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';

export class UserRegisterUseCase
  implements IUseCase<INewUserDomainCommand, UserDomainModel>
{
  constructor(
    private readonly storeEvent$: IStoreEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    registerUserCommand: INewUserDomainCommand,
  ): Observable<UserDomainModel> {
    const newUser = this.entityFactory(registerUserCommand);
    const event = this.eventFactory(newUser);
    return this.storeEvent$
      .getEventByAggregateRootId(registerUserCommand.branchId)
      .pipe(
        switchMap(() => {
          return this.storeEvent$.storeEvent(event).pipe(
            switchMap((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return of(newUser);
            }),
          );
        }),
      );
  }

  private entityFactory(
    registerUserCommand: INewUserDomainCommand,
  ): UserDomainModel {
    const userData = new UserDomainModel(
      registerUserCommand.firstName?.trim()?.toUpperCase() +
        ' ' +
        registerUserCommand.lastName?.trim()?.toUpperCase(),
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

  private eventFactory(userData: UserDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      userData.branchId,
      JSON.stringify(userData),
      new Date(),
      TypeNameEnum.USER_REGISTERED,
    );
    return event;
  }
}
