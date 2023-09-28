import { UserDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewUserDomainDto } from '@domain-dtos';
import {
  IStoredEventDomainService,
  IUserDomainService,
} from '@domain-services';
import { UserRegisteredEventPublisher } from '@domain-publishers';
import { UserEmailValueObject, UserNameValueObject } from '@value-objects/user';
import { ValueObjectBase, ValueObjectErrorHandler } from '@sofka/bases';
import { ValueObjectException } from '@sofka/exceptions';

export class UserRegisterUseCase extends ValueObjectErrorHandler {
  constructor(
    private readonly user$: IUserDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly userRegisteredDomainEvent: UserRegisteredEventPublisher,
  ) {
    super();
  }

  execute(registerUserDto: INewUserDomainDto): Observable<UserDomainModel> {
    const valueObjects = this.createValueObjects(registerUserDto);
    this.validateValueObjects(valueObjects);
    const user = this.entityFactory(registerUserDto);
    return this.user$.createUser(user).pipe(
      tap((user: UserDomainModel) => {
        this.eventHandler(user);
      }),
    );
  }

  private createValueObjects(
    command: INewUserDomainDto,
  ): ValueObjectBase<any>[] {
    const name = new UserNameValueObject({
      firstName: command.firstName,
      lastName: command.lastName,
    });
    const email = new UserEmailValueObject(command.email);
    return [email, name];
  }

  private validateValueObjects(valueObjects: ValueObjectBase<any>[]) {
    this.cleanErrors();
    for (const valueObject of valueObjects) {
      if (valueObject.hasErrors()) {
        this.setErrors(valueObject.getErrors());
      }
    }
    if (this.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        this.getErrors(),
      );
    }
  }

  private entityFactory(registerUserDto: INewUserDomainDto): UserDomainModel {
    this.validateValueObjects(this.createValueObjects(registerUserDto));
    return {
      name:
        registerUserDto.firstName.trim().toUpperCase() +
        ' ' +
        registerUserDto.lastName.trim().toUpperCase(),
      email: registerUserDto.email,
      password: registerUserDto.password,
      role: registerUserDto.role,
    };
  }

  private eventHandler(user: UserDomainModel): void {
    console.log('User created: ', user);
    this.userRegisteredDomainEvent.response = user;
    this.userRegisteredDomainEvent.publish();
    this.storedEvent$.createStoredEvent({
      aggregateRootId: user?.id?.valueOf() ?? 'null',
      eventBody: JSON.stringify(user),
      occurredOn: new Date(),
      typeName: 'ProductRegistered',
    });
  }
}
