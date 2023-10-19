import { Test, TestingModule } from '@nestjs/testing';
import { BranchListener } from './branch.listener';
import { BranchRegisteredUseCase } from '@use-cases-query';
import { EventDomainModel } from '@domain-models';
import { TypeNameEnum } from '@enums';
import { of } from 'rxjs';

describe('BranchListener', () => {
  let listener: BranchListener;
  let branchRegisteredUseCase: BranchRegisteredUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchListener,
        {
          provide: BranchRegisteredUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    listener = module.get<BranchListener>(BranchListener);
    branchRegisteredUseCase = module.get<BranchRegisteredUseCase>(
      BranchRegisteredUseCase,
    );
  });

  it('should be defined', () => {
    // Assert
    expect(listener).toBeDefined();
  });

  describe('branchRegistered', () => {
    it('should call branchRegisteredUseCase.execute with the correct argument', (done) => {
      // Arrange
      const mockEvent: EventDomainModel = {
        aggregateRootId: 'mockedAggregateRootId',
        eventBody: {
          name: 'mockedName',
          location: 'mockedAddress',
          id: 'mockedId',
        },
        occurredOn: new Date(),
        typeName: TypeNameEnum.BRANCH_REGISTERED,
      };
      jest
        .spyOn(branchRegisteredUseCase, 'execute')
        .mockReturnValueOnce(of({} as any));

      // Act
      listener.branchRegistered(mockEvent);

      // Assert
      setTimeout(() => {
        expect(branchRegisteredUseCase.execute).toHaveBeenCalledWith(mockEvent);
        done();
      });
    });
  });
});
