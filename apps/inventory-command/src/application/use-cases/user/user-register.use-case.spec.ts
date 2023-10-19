import { UserRegisterUseCase } from './user-register.use-case';
import { EventDomainModel, UserDomainModel } from '@domain-models';
import { Observable, of, throwError } from 'rxjs';
import { INewUserDomainCommand } from '@domain-commands';
import { IEventDomainService, IMailDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { TypeNameEnum, UserRoleEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

describe('UserRegisterUseCase', () => {
  let userRegisterUseCase: UserRegisterUseCase;
  let mockEventDomainService: IEventDomainService;
  let mockEventPublisher: DomainEventPublisher;
  let mockMailDomainService: IMailDomainService;

  beforeEach(() => {
    mockEventDomainService = {
      entityAlreadyExist: jest.fn(),
      getLastEventByEntityId: jest.fn(),
      storeEvent: jest.fn(),
    } as unknown as IEventDomainService;

    mockEventPublisher = {
      response: null,
      publish: jest.fn(),
    } as unknown as DomainEventPublisher;

    mockMailDomainService = {
      sendEmail: jest.fn(),
    } as unknown as IMailDomainService;

    userRegisterUseCase = new UserRegisterUseCase(
      mockEventDomainService,
      mockEventPublisher,
      mockMailDomainService,
    );
  });
  // Arrange
  const newUserCommand: INewUserDomainCommand = {
    fullName: {
      firstName: 'John',
      lastName: 'MockLastName',
    },
    email: 'johndoe@example.com',
    password: 'Password123',
    role: UserRoleEnum.ADMIN,
    branchId: 'f8b50d31-17f8-4f37-ac60-d98157ad6dd5',
  };

  const userDomainModel: UserDomainModel = new UserDomainModel(
    newUserCommand.fullName.firstName + ' ' + newUserCommand.fullName.lastName,
    newUserCommand.email,
    newUserCommand.password,
    newUserCommand.role,
    newUserCommand.branchId,
  );

  const userRegisteredEvent: EventDomainModel = {
    eventBody: userDomainModel,
    aggregateRootId: newUserCommand.branchId,
    occurredOn: new Date(),
    typeName: TypeNameEnum.USER_REGISTERED,
  };

  describe('execute', () => {
    it('should register a user and return the registered user', (done) => {
      //Arrange
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(mockEventDomainService, 'getLastEventByEntityId')
        .mockReturnValue(of(null as any));
      jest
        .spyOn(mockEventDomainService, 'storeEvent')
        .mockReturnValue(of(userRegisteredEvent));

      jest
        .spyOn(mockMailDomainService, 'sendEmail')
        .mockReturnValue(of('Email sent successfully'));
      jest
        .spyOn(userRegisterUseCase as any, 'entityFactory')
        .mockReturnValue(userDomainModel);

      // Act
      const result: Observable<UserDomainModel> =
        userRegisterUseCase.execute(newUserCommand);

      // Assert
      result.subscribe({
        next: (user: UserDomainModel) => {
          expect(user).toEqual(userDomainModel);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith(
            'email',
            newUserCommand.email,
            [TypeNameEnum.USER_REGISTERED],
            newUserCommand.branchId,
          );
          expect(
            mockEventDomainService.getLastEventByEntityId,
          ).toHaveBeenCalled();
          expect(mockEventDomainService.storeEvent).toHaveBeenCalled();
          expect(mockMailDomainService.sendEmail).toHaveBeenCalledWith(
            [newUserCommand.email],
            expect.any(String),
            expect.any(String),
          );
          expect(mockEventPublisher.publish).toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw ConflictException if email already exists', (done) => {
      // Arrange
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(true));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisterUseCase.execute(newUserCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(ConflictException);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith(
            'email',
            newUserCommand.email,
            [TypeNameEnum.USER_REGISTERED],
            newUserCommand.branchId,
          );
          expect(
            mockEventDomainService.getLastEventByEntityId,
          ).not.toHaveBeenCalled();
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockMailDomainService.sendEmail).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw ValueObjectException if user data is invalid', (done) => {
      // Arrange
      const password = newUserCommand.password;
      newUserCommand.password = '';
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(mockEventDomainService, 'getLastEventByEntityId')
        .mockReturnValue(of(null as any));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisterUseCase.execute(newUserCommand);
      newUserCommand.password = password;

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(ValueObjectException);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).not.toHaveBeenCalled();
          expect(
            mockEventDomainService.getLastEventByEntityId,
          ).not.toHaveBeenCalled();
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockMailDomainService.sendEmail).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw ConflictException if branch does not exist', (done) => {
      // Arrange
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(mockEventDomainService, 'getLastEventByEntityId')
        .mockReturnValue(throwError(() => new Error('Branch not found')));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisterUseCase.execute(newUserCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(ConflictException);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith(
            'email',
            newUserCommand.email,
            [TypeNameEnum.USER_REGISTERED],
            newUserCommand.branchId,
          );
          expect(
            mockEventDomainService.getLastEventByEntityId,
          ).toHaveBeenCalled();
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockMailDomainService.sendEmail).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw error if event service throws error', (done) => {
      // Arrange

      const error = new Error('Event service error');
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(throwError(() => error));

      // Act
      const result: Observable<UserDomainModel> =
        userRegisterUseCase.execute(newUserCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBe(error);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith(
            'email',
            newUserCommand.email,
            [TypeNameEnum.USER_REGISTERED],
            newUserCommand.branchId,
          );
          expect(
            mockEventDomainService.getLastEventByEntityId,
          ).not.toHaveBeenCalled();
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockMailDomainService.sendEmail).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
