import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, catchError, map, of } from 'rxjs';
import { IAuthDomainService } from '@domain-services/index';
import { UserDomainModel } from '@domain-models/user.domain-model';
import { ILoginResponse } from 'apps/domain/interfaces';

@Injectable()
export class AuthService implements IAuthDomainService {
  constructor(private readonly jwtService: JwtService) {}
  verifyRefreshToken(token: string, id: string): Observable<boolean> {
    return of(token).pipe(
      map((token) => this.jwtService.verify(token)),
      map((some: any) => {
        return some.userId === id;
      }),
      catchError((error) => {
        if (error.name === 'TokenExpiredError') {
          return of(true);
        }
        throw error;
      }),
    );
  }
  generateAuthResponse(user: UserDomainModel): Observable<ILoginResponse> {
    const data = {
      branchId: user.branchId,
      role: user.role,
      userId: user.id,
    };
    const token = this.jwtService.sign(data);
    return of({ data, token });
  }
}
