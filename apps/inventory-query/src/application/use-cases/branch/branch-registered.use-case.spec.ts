import { of } from 'rxjs';
import { EventDomainModel, BranchDomainModel } from '@domain-models';
import { ValueObjectException } from '@sofka/exceptions';
import { IBranchDomainService } from '@domain-services';
import { BranchRegisteredUseCase } from '..';
import { TypeNameEnum } from '@domain';

describe('BranchRegisteredUseCase', () => {
  let mockBranchService: IBranchDomainService;
  let branchRegisteredUseCase: BranchRegisteredUseCase;
  const newBranch = new BranchDomainModel(
    'SUCURSAL',
    'UBICACIÓN',
    [],
    [],
    [],
    '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
  );
  const event: EventDomainModel = {
    eventBody: newBranch,
    aggregateRootId: newBranch.id,
    occurredOn: new Date(),
    typeName: TypeNameEnum.BRANCH_REGISTERED,
  };

  beforeEach(() => {
    mockBranchService = {
      createBranch: jest.fn(),
    } as unknown as IBranchDomainService;

    // Crea una nueva instancia del caso de uso con el mock del servicio
    branchRegisteredUseCase = new BranchRegisteredUseCase(mockBranchService);
  });

  describe('execute', () => {
    it('should return an observable with the branch registered', (done) => {
      // Arrange
      jest
        .spyOn(mockBranchService, 'createBranch')
        .mockReturnValueOnce(of(newBranch));

      // Act
      const result = branchRegisteredUseCase.execute(event);
      result.subscribe({
        next: (branch) => {
          // Assert
          expect(branch).toEqual(newBranch);
          expect(mockBranchService.createBranch).toHaveBeenCalledWith(
            newBranch,
          );
          done();
        },
        error: () => {
          done.fail('El observable no debería emitir un error');
        },
      });
    });
  });

  it('should return an observable with an error when the branch is not registered', (done) => {
    // Arrange
    const branchWithErrors = new BranchDomainModel(
      '',
      'Ubicación',
      [],
      [],
      [],
      '2897ddc8-4ec7-420c-a8cc-38530adc8d23',
    );
    const eventWithErrors: EventDomainModel = {
      eventBody: branchWithErrors,
      aggregateRootId: branchWithErrors.id,
      occurredOn: new Date(),
      typeName: TypeNameEnum.BRANCH_REGISTERED,
    };
    jest
      .spyOn(mockBranchService, 'createBranch')
      .mockReturnValueOnce(of(newBranch));

    // Act
    const result = branchRegisteredUseCase.execute(eventWithErrors);

    // Assert
    result.subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(ValueObjectException);
        expect(error.message).toEqual(
          'Existen algunos errores en los datos ingresados',
        );
        expect(mockBranchService.createBranch).not.toHaveBeenCalled();
        done();
      },
    });
  });
});
