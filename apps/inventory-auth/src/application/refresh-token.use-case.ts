import { ITokenCommand } from '@domain-commands';
import { UserDomainModel } from '@domain-models';
import { IAuthDomainService, IUserAuthDomainService } from '@domain-services';
import { BadRequestException } from '@nestjs/common';
import { IUseCase } from '@sofka/interfaces';
import { ILoginResponse } from 'apps/domain/interfaces';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';

export class RefreshTokenUseCase implements IUseCase<ITokenCommand, string> {
  constructor(
    private readonly user$: IUserAuthDomainService,
    private readonly auth$: IAuthDomainService,
  ) {}

  execute(command: ITokenCommand): Observable<string> {
    return this.auth$.verifyRefreshToken(command.token, command.id).pipe(
      switchMap((valid: boolean) => {
        if (valid) {
          return this.user$.findById(command.id).pipe(
            switchMap((user: UserDomainModel) =>
              this.auth$.generateAuthResponse(user).pipe(
                switchMap((response: ILoginResponse) => {
                  return of(response.token);
                }),
              ),
            ),
          );
        } else {
          return throwError(() => 'Token inválido');
        }
      }),
      catchError(() => {
        throw new BadRequestException('Token inválido');
      }), // Maneja errores de verificación del token de actualización
    );
  }
}
