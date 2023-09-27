import { UserDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewUserDomainDto } from '@domain-dtos';
import {
  IStoredEventDomainService,
  IUserDomainService,
} from '@domain-services';
import { UserRegisteredEventPublisher } from '@domain-publishers';

export class UserRegisterUseCase {
  constructor(
    private readonly user$: IUserDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly userRegisteredDomainEvent: UserRegisteredEventPublisher,
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
