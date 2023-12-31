﻿import { BranchDomainModel } from '@domain-models';
import { Observable, tap } from 'rxjs';
// import { RegisteredNewBranchDomainEvent } from '../../domain/events/publishers';
import { INewBranchDomainDto } from '@domain-dtos';
import { IBranchDomainService } from '@domain-services';

export class RegisterBranchUseCase {
  constructor(
    private readonly branch$: IBranchDomainService, // private readonly registeredNewBranchDomainEvent: RegisteredNewBranchDomainEvent,
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
