// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { EventService } from '../../persistence';
import { EventDomainModel } from '@domain-models/event.domain-model';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: EventService,
  ) {}

  validateUser(email: string, password: string): Observable<{ token: string }> {
    return this.userService.auth(email, password).pipe(
      switchMap((user: EventDomainModel) => {
        if (user) {
          return of(this.login(user.eventBody));
        }
        return throwError(() => new UnauthorizedException());
      }),
    );
  }

  login(user: any) {
    const payload = {
      branchId: user.branchId,
      role: user.role,
      userId: user.id,
    };
    return { token: this.jwtService.sign(payload) };
  }
}
