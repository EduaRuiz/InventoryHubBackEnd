import { Test, TestingModule } from '@nestjs/testing';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';
import { UserRegisteredUseCase } from '../../application';
import { UserListener } from './user.listener';
import { of, throwError } from 'rxjs';

describe('UserListener', () => {
  let listener: UserListener;
  let userRegisteredUseCase: UserRegisteredUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserListener,
        {
          provide: UserRegisteredUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<UserListener>(UserListener);
    userRegisteredUseCase = module.get<UserRegisteredUseCase>(
      UserRegisteredUseCase,
    );
  });

  it('should be defined', () => {
    // Assert
    expect(listener).toBeDefined();
  });

  describe('userRegistered', () => {
    it('should call userRegisteredUseCase.execute with the correct argument', (done) => {
      // Arrange
      const mockEvent: EventDomainModel = {
        aggregateRootId: 'mockedAggregateRootId',
        eventBody: {
          fullName: 'mockedFullName',
          email: 'mockedEmail',
          password: 'mockedPassword',
          role: 'mockedRole',
          branchId: 'mockedBranchId',
          id: 'mockedId',
        },
        occurredOn: new Date(),
        typeName: TypeNameEnum.USER_REGISTERED,
      };
      jest
        .spyOn(userRegisteredUseCase, 'execute')
        .mockReturnValue(of({} as any));

      // Act
      listener.userRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(userRegisteredUseCase.execute).toHaveBeenCalledWith(mockEvent);
        done();
      });
    });

    it('should return an error when userRegisteredUseCase.execute throws an error', (done) => {
      // Arrange
      const mockEvent: EventDomainModel = {
        aggregateRootId: 'mockedAggregateRootId',
        eventBody: {
          fullName: 'mockedFullName',
          email: 'mockedEmail',
          password: 'mockedPassword',
          role: 'mockedRole',
          branchId: 'mockedBranchId',
          id: 'mockedId',
        },
        occurredOn: new Date(),
        typeName: TypeNameEnum.USER_REGISTERED,
      };
      const expected = new Error('Name is required');
      jest
        .spyOn(userRegisteredUseCase, 'execute')
        .mockReturnValue(throwError(() => expected));

      // Act
      listener.userRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(userRegisteredUseCase.execute).toHaveBeenCalledWith(mockEvent);
        done();
      });
    });
  });
});
