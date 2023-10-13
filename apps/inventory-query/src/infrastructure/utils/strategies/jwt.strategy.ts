import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { UserService } from '../../persistence/services';
import { IUserAuthData } from 'apps/domain/interfaces';
import { UserDomainModel } from '@domain-models/index';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  validate(payload: IUserAuthData): Observable<IUserAuthData> {
    const { userId } = payload;

    return this.userService.getUserById(userId).pipe(
      switchMap((user: UserDomainModel) => {
        if (!user)
          throwError(() => new UnauthorizedException('Token no valido'));
        return of({
          userId: user.id,
          role: user.role,
          branchId: user.branchId,
        });
      }),
    );
  }
}
