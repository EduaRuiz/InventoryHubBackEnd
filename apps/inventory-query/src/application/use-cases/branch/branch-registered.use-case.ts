import { EventDomainModel, BranchDomainModel } from '@domain-models';
import { IBranchDomainService } from '@domain-services';
import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { Observable, throwError } from 'rxjs';

export class BranchRegisteredUseCase
  implements IUseCase<EventDomainModel, BranchDomainModel>
{
  constructor(private readonly branch$: IBranchDomainService) {}
  execute(command: EventDomainModel): Observable<BranchDomainModel> {
    const branchRegistered = command.eventBody as BranchDomainModel;
    branchRegistered.name = branchRegistered.name?.trim().toUpperCase();
    const newBranch = this.entityFactory(branchRegistered);
    if (newBranch.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newBranch.getErrors(),
          ),
      );
    }
    return this.branch$.createBranch(newBranch);
  }

  private entityFactory(
    branchRegistered: BranchDomainModel,
  ): BranchDomainModel {
    const branchData = new BranchDomainModel(
      branchRegistered.name,
      branchRegistered.location,
      [],
      [],
      [],
      branchRegistered.id,
    );
    return branchData;
  }
}
