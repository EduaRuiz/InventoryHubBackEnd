import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, map, of, switchMap, catchError } from 'rxjs';
import * as jwt from 'jsonwebtoken';

/**
 * Guard de JWT para proteger rutas
 *
 * @export
 * @class JwtGuard
 * @implements {CanActivate}
 */
@Injectable()
export class JwtGuard implements CanActivate {
  /**
   * Verificar si el usuario tiene permiso para acceder a la ruta
   *
   * @param {ExecutionContext} context Contexto de ejecución
   * @return {Observable<boolean>} Observable de booleano que indica si el usuario tiene permiso para acceder a la ruta
   * @memberof JwtGuard
   */
  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    return of(token).pipe(
      map((token) => (token ? jwt.verify(token, 'll4v3') : null)),
      catchError((err: Error) => {
        throw new UnauthorizedException(err.message);
      }),
      switchMap((decoded) => (decoded ? of(true) : of(false))),
    );
  }
}
