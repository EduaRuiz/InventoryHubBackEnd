import { of } from 'rxjs';
import { EventDomainModel, UserDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { IUserDomainService } from '@domain-services';
import { UserRegisteredUseCase } from '..';
import { TypeNameEnum, UserRoleEnum } from '@enums';

describe('UserRegisteredUseCase', () => {
  let mockUserService: IUserDomainService;
  let userRegisteredUseCase: UserRegisteredUseCase;
  const newUser = new UserDomainModel(
    'NAME',
    'email@email.com',
    'Password1234',
    UserRoleEnum.ADMIN,
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  );
  const event: EventDomainModel = {
    eventBody: newUser,
    aggregateRootId: newUser.id,
    occurredOn: new Date(),
    typeName: TypeNameEnum.PRODUCT_REGISTERED,
  };

  beforeEach(() => {
    mockUserService = {
      createUser: jest.fn(),
    } as unknown as IUserDomainService;

    // Crea una nueva instancia del caso de uso con el mock del servicio
    userRegisteredUseCase = new UserRegisteredUseCase(mockUserService);
  });

  describe('execute', () => {
    it('should return an observable with the user registered', (done) => {
      // Arrange
      jest
        .spyOn(mockUserService, 'createUser')
        .mockReturnValueOnce(of(newUser));

      // Act
      const result = userRegisteredUseCase.execute(event);
      result.subscribe({
        next: (user) => {
          // Assert
          expect(user).toEqual(newUser);
          expect(mockUserService.createUser).toHaveBeenCalledWith(newUser);
          done();
        },
        error: () => {
          done.fail('El observable no debería emitir un error');
        },
      });
    });
  });

  it('should return an observable with an error when the user is not registered', (done) => {
    // Arrange
    const userWithErrors = new UserDomainModel(
      '',
      'email@email.com',
      'Password1234',
      UserRoleEnum.ADMIN,
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    );
    const eventWithErrors: EventDomainModel = {
      eventBody: userWithErrors,
      aggregateRootId: userWithErrors.id,
      occurredOn: new Date(),
      typeName: TypeNameEnum.PRODUCT_REGISTERED,
    };
    jest.spyOn(mockUserService, 'createUser').mockReturnValueOnce(of(newUser));

    // Act
    const result = userRegisteredUseCase.execute(eventWithErrors);

    // Assert
    result.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(ValueObjectException);
        expect(error.message).toEqual(
          'Existen algunos errores en los datos ingresados',
        );
        expect(mockUserService.createUser).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
