import { BranchDomainModel } from '@domain-models/branch.domain-model';
import { DomainEventPublisher } from '@domain-publishers/index';
import { IEventDomainService } from '@domain-services/index';
import { IUseCase } from '@sofka/interfaces';
import { Observable } from 'rxjs';
import { BranchRegisterUseCase } from './branch-register.use-case';

export class MailSenderDelegator
  implements IUseCase<any, BranchDomainModel | BranchDomainModel[]>
{
  private delegate: IUseCase<any, any>;

  constructor(
    private readonly event$: IEventDomainService,
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  execute<Response>(...args: any[]): Observable<Response> {
    return this.delegate.execute(...args);
  }

  toBranchRegisterUseCase(): void {
    this.delegate = new BranchRegisterUseCase(this.event$, this.eventPublisher);
  }
}
