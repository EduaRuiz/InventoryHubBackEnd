import { BranchDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
import { INewBranchDomainDto } from '@domain-dtos';
import {
  IBranchDomainService,
  IStoredEventDomainService,
} from '@domain-services';
import { BranchRegisteredEventPublisher } from '../../../domain/events/publishers/branch-registered.event-publisher';

export class BranchRegisterUseCase {
  constructor(
    private readonly branch$: IBranchDomainService,
    private readonly storedEvent$: IStoredEventDomainService,
    private readonly branchRegisteredEventPublisher: BranchRegisteredEventPublisher,
  ) {}

  execute(
    registerBranchDto: INewBranchDomainDto,
  ): Observable<BranchDomainModel> {
    registerBranchDto.name = registerBranchDto.name.trim().toUpperCase();
    const newBranch = {
      products: [],
      users: [],
      location:
        registerBranchDto.location?.city + registerBranchDto.location?.country,
      name: registerBranchDto.name,
    };
    return this.branch$.createBranch(newBranch).pipe(
      tap((branch: BranchDomainModel) => {
        console.log('Branch created: ', branch);
        // this.registeredNewBranchDomainEvent.publish(branch);
      }),
    );
  }
}
