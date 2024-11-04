import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from './auth.service';
import { getTokens, TokenBulk } from '../utils';

export class AuthInterceptorService implements HttpInterceptor {
  authService = inject(AuthService);

  private isRefreshingToken: Boolean = false;
  private refreshTokenSubject: BehaviorSubject<TokenBulk | null> =
    new BehaviorSubject<TokenBulk | null>(null);

  intercept(request: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(this.addTokenToRequest(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(request, next);
        }

        return throwError(() => error);
      })
    );
  }

  handle401Error(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token) => {
          this.refreshTokenSubject.next(token);
          return next.handle(this.addTokenToRequest(request));
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter((result) => result !== null),
      take(1),
      switchMap(() => next.handle(this.addTokenToRequest(request)))
    );
  }

  private addTokenToRequest(
    request: HttpRequest<unknown>
  ): HttpRequest<unknown> {
    const { accessToken } = getTokens();

    if (!accessToken) return request;

    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}
