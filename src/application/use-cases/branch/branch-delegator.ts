import { BranchDomainModel } from '@domain-models/branch.domain-model';
import { BranchRegisteredEventPublisher } from '@domain-publishers/index';
import { IBranchDomainService } from '@domain-services/index';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { BranchRegisterUseCase } from './branch-register.use-case';

export class MailSenderDelegator
  implements IUseCase<any, BranchDomainModel | BranchDomainModel[]>
{
  private delegate: IUseCase<any, any>;

  constructor(
    private readonly branch$: IBranchDomainService,
    private readonly branchRegisteredEventPublisher: BranchRegisteredEventPublisher,
  ) {}

  execute<Response>(...args: any[]): Observable<Response> {
    return this.delegate.execute(...args);
  }

  toBranchRegisterUseCase(): void {
    this.delegate = new BranchRegisterUseCase(
      this.branch$,
      this.branchRegisteredEventPublisher,
    );
  }
}
