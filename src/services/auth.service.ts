import { inject, Injectable, signal } from '@angular/core';
import { catchError, from, Observable, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { clearTokens, getTokens, setTokens, TokenBulk } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);

  isAuthenticatedSignal = signal<boolean>(false);

  refreshToken(): Observable<TokenBulk> {
    const { refreshToken } = getTokens();

    return from(
      this.apiService.post<TokenBulk>('token/refresh', {
        refresh_token: refreshToken,
      })
    ).pipe(
      tap((response) => {
        setTokens(response);
      }),
      catchError((error) => {
        clearTokens();
        this.unAuthenticate();

        return throwError(() => error);
      })
    );
  }

  authenticate() {
    this.isAuthenticatedSignal.set(true);
  }

  unAuthenticate() {
    this.isAuthenticatedSignal.set(false);
    clearTokens();
  }

  isAuthenticated() {
    return this.isAuthenticatedSignal();
  }
}
