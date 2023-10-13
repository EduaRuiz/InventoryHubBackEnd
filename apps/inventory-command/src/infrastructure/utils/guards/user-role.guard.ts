import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IUserAuthData } from 'apps/domain/interfaces';
import { Observable, map, of, tap } from 'rxjs';

@Injectable()
export class UserRolGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const validateRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!validateRoles) return of(false);
    if (validateRoles.length == 0) return of(false);

    const request = context.switchToHttp().getRequest();
    const user = request.user as Observable<IUserAuthData>;
    return user.pipe(
      tap((data: IUserAuthData) => {
        if (!data) {
          throw new UnauthorizedException(
            'El usuario no está definido en la solicitud',
          );
        }
        if (!validateRoles.includes(data.role)) {
          throw new UnauthorizedException(
            'No tienes permisos para realizar esta acción',
          );
        }
      }),
      map(() => true),
    );
  }
}
