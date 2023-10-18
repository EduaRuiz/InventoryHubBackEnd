import { ILoginDomainCommand } from '@domain-commands';
import { UserDomainModel } from '@domain-models';
import { IAuthDomainService, IUserAuthDomainService } from '@domain-services';
import { IUseCase } from '@sofka/interfaces';
import { ILoginResponse } from 'apps/domain/interfaces';
import { Observable, switchMap } from 'rxjs';

export class LoginUseCase
  implements IUseCase<ILoginDomainCommand, ILoginResponse>
{
  constructor(
    private readonly user$: IUserAuthDomainService,
    private readonly auth$: IAuthDomainService,
  ) {}

  execute(command: ILoginDomainCommand): Observable<ILoginResponse> {
    return this.user$
      .login(command.email, command.password)
      .pipe(
        switchMap((user: UserDomainModel) =>
          this.auth$.generateAuthResponse(user),
        ),
      );
  }
}
