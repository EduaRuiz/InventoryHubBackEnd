import { IUserAuthDomainService } from '@domain-services';
import { IUseCase } from '@sofka/interfaces';
import { ValueObjectException } from '@sofka/exceptions';
import { EventDomainModel, UserDomainModel } from '@domain-models';
import { Observable, throwError } from 'rxjs';

export class UserRegisteredUseCase
  implements IUseCase<EventDomainModel, UserDomainModel>
{
  constructor(private readonly user$: IUserAuthDomainService) {}
  execute(command: EventDomainModel): Observable<UserDomainModel> {
    const userRegistered = command.eventBody as UserDomainModel;
    const newUser = this.entityFactory(userRegistered);
    if (newUser.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newUser.getErrors(),
          ),
      );
    }
    return this.user$.registerUser(newUser);
  }

  private entityFactory(userRegistered: UserDomainModel): UserDomainModel {
    const userData = new UserDomainModel(
      userRegistered.fullName,
      userRegistered.email,
      userRegistered.password,
      userRegistered.role,
      userRegistered.branchId,
      userRegistered.id,
    );
    return userData;
  }
}
