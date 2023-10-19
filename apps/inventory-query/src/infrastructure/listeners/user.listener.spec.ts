import { Test, TestingModule } from '@nestjs/testing';
import { UserListener } from './user.listener';
import { UserRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';
import { of } from 'rxjs';
import { UserRoleEnum } from '../../../../domain/enums/user-role.enum';

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
          id: 'mockedId',
          fullName: 'mockedFullName',
          email: 'mockedEmail',
          password: 'mockedPassword',
          role: UserRoleEnum.ADMIN,
          branchId: 'mockedBranchId',
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
  });
});
