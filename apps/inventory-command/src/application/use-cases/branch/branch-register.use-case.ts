﻿import { BranchDomainModel, EventDomainModel } from '@domain-models';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { INewBranchDomainCommand } from '@domain-commands';
import { IEventDomainService } from '@domain-services';
import { DomainEventPublisher } from '@domain-publishers';

import { ValueObjectException } from '@sofka/exceptions';
import { IUseCase } from '@sofka/interfaces';
import { TypeNameEnum } from '@enums';
import { ConflictException } from '@nestjs/common';

export class BranchRegisterUseCase
  implements IUseCase<INewBranchDomainCommand, BranchDomainModel>
{
  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute(
    newBranchCommand: INewBranchDomainCommand,
  ): Observable<BranchDomainModel> {
    newBranchCommand.name = newBranchCommand.name?.trim().toUpperCase();
    const newBranch = this.entityFactory(newBranchCommand);
    if (newBranch.hasErrors()) {
      return throwError(
        () =>
          new ValueObjectException(
            'Existen algunos errores en los datos ingresados',
            newBranch.getErrors(),
          ),
      );
    }
    const event = this.eventFactory(newBranch);
    return this.event$
      .entityAlreadyExist('name', newBranch.name, [
        TypeNameEnum.BRANCH_REGISTERED,
      ])
      .pipe(
        switchMap((exist: boolean) => {
          if (exist) throw new ConflictException('El nombre ya existe');
          return this.event$.storeEvent(event).pipe(
            switchMap((event: EventDomainModel) => {
              this.eventPublisher.response = event;
              this.eventPublisher.publish();
              return of(newBranch);
            }),
          );
        }),
      );
  }

  private entityFactory(
    newBranchCommand: INewBranchDomainCommand,
  ): BranchDomainModel {
    const branchData = new BranchDomainModel(
      newBranchCommand.name,
      newBranchCommand.location.city + ', ' + newBranchCommand.location.country,
      [],
      [],
      [],
    );
    return branchData;
  }

  private eventFactory(branch: BranchDomainModel): EventDomainModel {
    const event = new EventDomainModel(
      branch?.id ?? '',
      branch,
      new Date(),
      TypeNameEnum.BRANCH_REGISTERED,
    );
    return event;
  }
}
