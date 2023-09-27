import { UserDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
// import { RegisteredNewUserDomainEvent } from '../../domain/events/publishers';
import { INewUserDomainDto } from '@domain-dtos';
import { IUserDomainService } from '@domain-services';

export class RegisterUserUseCase {
  constructor(
    private readonly user$: IUserDomainService, // private readonly registeredNewUserDomainEvent: RegisteredNewUserDomainEvent,
  ) {}

  execute(registerUserDto: INewUserDomainDto): Observable<UserDomainModel> {
    registerUserDto.name = registerUserDto.name.trim().toUpperCase();
    return this.user$.createUser(registerUserDto).pipe(
      tap((user: UserDomainModel) => {
        console.log('User created: ', user);
        // this.registeredNewUserDomainEvent.publish(user);
      }),
    );
  }
}
