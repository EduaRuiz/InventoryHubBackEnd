import { UserDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewUserDomainCommand } from 'src/domain/commands';
import { IUserDomainService } from '@domain-services';
import { UserRegisteredEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class UserRegisterUseCase
  implements IUseCase<INewUserDomainCommand, UserDomainModel>
{
  constructor(
    private readonly user$: IUserDomainService,
    private readonly userRegisteredDomainEvent: UserRegisteredEventPublisher,
  ) {}

  execute(
    registerUserCommand: INewUserDomainCommand,
  ): Observable<UserDomainModel> {
    const userData = this.entityFactory(registerUserCommand);
    if (userData.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        userData.getErrors(),
      );
    }
    return this.user$.createUser(userData).pipe(
      tap((user: UserDomainModel) => {
        this.eventHandler(user);
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

    return userData;
  }

  private eventHandler(user: UserDomainModel): void {
    console.log('User created: ', user);
    this.userRegisteredDomainEvent.response = user;
    this.userRegisteredDomainEvent.publish();
  }
}
