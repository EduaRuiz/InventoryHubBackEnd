import { BranchDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewBranchDomainCommand } from 'src/domain/commands';
import { IBranchDomainService } from '@domain-services';
import { BranchRegisteredEventPublisher } from '@domain-publishers';

import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';

export class BranchRegisterUseCase
  implements IUseCase<INewBranchDomainCommand, BranchDomainModel>
{
  constructor(
    private readonly branch$: IBranchDomainService,
    private readonly branchRegisteredEventPublisher: BranchRegisteredEventPublisher,
  ) {}

  execute(
    newBranchCommand: INewBranchDomainCommand,
  ): Observable<BranchDomainModel> {
    newBranchCommand.name = newBranchCommand.name?.trim().toUpperCase();
    const newBranch = this.entityFactory(newBranchCommand);
    if (newBranch.hasErrors()) {
      throw new ValueObjectException(
        'Existen algunos errores en los datos ingresados',
        newBranch.getErrors(),
      );
    }
    return this.branch$.createBranch(newBranch).pipe(
      tap((branch: BranchDomainModel) => {
        this.eventHandler(branch);
      }),
    );
  }

  private entityFactory(
    newBranchCommand: INewBranchDomainCommand,
  ): BranchDomainModel {
    const branchData = new BranchDomainModel(
      newBranchCommand.name,
      newBranchCommand.city + ', ' + newBranchCommand.country,
      [],
      [],
    );
    branchData;
    return branchData;
  }

  private eventHandler(branch: BranchDomainModel): void {
    this.branchRegisteredEventPublisher.response = branch;
    this.branchRegisteredEventPublisher.publish();
  }
}
