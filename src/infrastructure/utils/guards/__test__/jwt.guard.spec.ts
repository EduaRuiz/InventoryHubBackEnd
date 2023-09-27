import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { JwtGuard } from '..';

describe('JwtGuard', () => {
  let guard: JwtGuard;
  let context: ExecutionContext;
  let request: any;
  const token = jwt.sign({ id: '1' }, 'll4v3');
  const secret = 'll4v3';

  beforeEach(() => {
    guard = new JwtGuard();
    request = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;
  });

  describe('when canActivate is called', () => {
    // Arrange
    let result$: Observable<boolean>;

    describe('and token is valid', () => {
      beforeEach(() => {
        // Act
        result$ = guard.canActivate(context);
      });

      it('should return true', (done) => {
        // Assert
        result$.subscribe((result) => {
          expect(result).toEqual(true);
          done();
        });
      });
    });

    describe('and token is invalid', () => {
      beforeEach(() => {
        // Arrange
        const invalidToken = 'invalid-token';
        request.headers.authorization = `Bearer ${invalidToken}`;

        // Act
        result$ = guard.canActivate(context);
      });

      it('should throw an UnauthorizedException', (done) => {
        // Assert
        result$.subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(UnauthorizedException);
            done();
          },
        });
      });
    });

    describe('and there is no token', () => {
      beforeEach(() => {
        // Arrange
        request.headers.authorization = undefined;

        // Act
        result$ = guard.canActivate(context);
      });

      it('should return false', (done) => {
        // Assert
        result$.subscribe((result) => {
          expect(result).toEqual(false);
          done();
        });
      });
    });

    describe('and token is expired', () => {
      beforeEach(() => {
        // Arrange
        const expiredToken = jwt.sign({ foo: 'bar' }, secret, {
          expiresIn: -1,
        });
        request.headers.authorization = `Bearer ${expiredToken}`;

        // Act
        result$ = guard.canActivate(context);
      });

      it('should throw an UnauthorizedException', (done) => {
        // Assert
        result$.subscribe({
          error: (error) => {
            expect(error).toBeInstanceOf(UnauthorizedException);
            done();
          },
        });
      });
    });
  });
});
