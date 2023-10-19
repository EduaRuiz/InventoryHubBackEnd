import { BranchDomainModel, EventDomainModel } from '@domain-models';
import { Observable, of, throwError } from 'rxjs';
import { INewBranchDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';
import { ValueObjectException } from '@sofka/exceptions';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';
import { BranchRegisterUseCase } from './branch-register.use-case';

describe('BranchRegisterUseCase', () => {
  let branchRegisterUseCase: BranchRegisterUseCase;
  let mockEventDomainService: IEventDomainService;
  let mockEventPublisher: DomainEventPublisher;

  beforeEach(() => {
    mockEventDomainService = {
      entityAlreadyExist: jest.fn(),
      storeEvent: jest.fn(),
    } as unknown as IEventDomainService;

    mockEventPublisher = {
      response: null,
      publish: jest.fn(),
    } as unknown as DomainEventPublisher;

    branchRegisterUseCase = new BranchRegisterUseCase(
      mockEventDomainService,
      mockEventPublisher,
    );
  });

  describe('execute', () => {
    it('should register a branch and return the registered branch', (done) => {
      // Arrange
      const newBranchCommand: INewBranchDomainCommand = {
        name: 'New Branch',
        location: {
          city: 'City',
          country: 'Country',
        },
      };

      const branchDomainModel: BranchDomainModel = new BranchDomainModel(
        newBranchCommand.name,
        newBranchCommand.location.city +
          ', ' +
          newBranchCommand.location.country,
        [],
        [],
        [],
        '13169ccc-1912-4fe0-890c-a8c405336045',
      );

      const branchRegisteredEvent: EventDomainModel = {
        eventBody: branchDomainModel,
        aggregateRootId: '13169ccc-1912-4fe0-890c-a8c405336045',
        occurredOn: new Date(),
        typeName: TypeNameEnum.BRANCH_REGISTERED,
      };

      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(false));
      jest
        .spyOn(mockEventDomainService, 'storeEvent')
        .mockReturnValue(of(branchRegisteredEvent));
      jest
        .spyOn(branchRegisterUseCase as any, 'entityFactory')
        .mockReturnValue(branchDomainModel);

      // Act
      const result: Observable<BranchDomainModel> =
        branchRegisterUseCase.execute(newBranchCommand);

      // Assert
      result.subscribe({
        next: (branch: BranchDomainModel) => {
          expect(branch).toEqual(branchDomainModel);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith('name', 'New Branch', [
            TypeNameEnum.BRANCH_REGISTERED,
          ]);
          expect(mockEventDomainService.storeEvent).toHaveBeenCalled();
          expect(mockEventPublisher.publish).toHaveBeenCalled();
          done();
        },
        error: (err: any) => {
          done.fail(err);
        },
      });
    });

    it('should throw ConflictException if branch name already exists', (done) => {
      // Arrange
      const newBranchCommand: INewBranchDomainCommand = {
        name: 'Existing Branch',
        location: {
          city: 'City',
          country: 'Country',
        },
      };

      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(of(true));

      // Act
      const result: Observable<BranchDomainModel> =
        branchRegisterUseCase.execute(newBranchCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBeInstanceOf(ConflictException);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith('name', newBranchCommand.name, [
            TypeNameEnum.BRANCH_REGISTERED,
          ]);
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw ValueObjectException if branch data is invalid', (done) => {
      // Arrange
      const newBranchCommand: INewBranchDomainCommand = {
        name: '', // Invalid branch name
        location: {
          city: 'City',
          country: 'Country',
        },
      };

      // Act
      const result: Observable<BranchDomainModel> =
        branchRegisterUseCase.execute(newBranchCommand);

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
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });

    it('should throw error if event service throws error', (done) => {
      // Arrange
      const newBranchCommand: INewBranchDomainCommand = {
        name: 'New Branch',
        location: {
          city: 'City',
          country: 'Country',
        },
      };

      const error = new Error('Event service error');
      jest
        .spyOn(mockEventDomainService, 'entityAlreadyExist')
        .mockReturnValue(throwError(() => error));

      // Act
      const result: Observable<BranchDomainModel> =
        branchRegisterUseCase.execute(newBranchCommand);

      // Assert
      result.subscribe({
        next: () => {
          done.fail('Should not be called');
        },
        error: (err: any) => {
          expect(err).toBe(error);
          expect(
            mockEventDomainService.entityAlreadyExist,
          ).toHaveBeenCalledWith('name', newBranchCommand.name, [
            TypeNameEnum.BRANCH_REGISTERED,
          ]);
          expect(mockEventDomainService.storeEvent).not.toHaveBeenCalled();
          expect(mockEventPublisher.publish).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });
});
