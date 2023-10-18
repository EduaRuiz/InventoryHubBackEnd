import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { EventService } from '../../persistence/services';
import { IUserAuthData } from 'apps/domain/interfaces';
import { TypeNameEnum } from '@enums';
import { EventDomainModel, UserDomainModel } from '@domain-models';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: EventService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  validate(payload: IUserAuthData): Observable<IUserAuthData> {
    const { userId } = payload;

    return this.userService
      .getLastEventByEntityId(userId, [TypeNameEnum.USER_REGISTERED])
      .pipe(
        switchMap((event: EventDomainModel) => {
          if (!event)
            throwError(() => new UnauthorizedException('Token no valido'));
          const user = event.eventBody as UserDomainModel;
          return of({
            userId: user.id,
            role: user.role,
            branchId: user.branchId,
          });
        }),
      );
  }
}
