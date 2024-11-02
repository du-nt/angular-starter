import { inject, Injectable, signal } from '@angular/core';
import { catchError, from, Observable, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';

export type TokenBulk = {
  accessToken: string;
  refreshToken: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiService = inject(ApiService);

  isAuthenticatedSignal = signal<boolean>(false);

  getTokens(): TokenBulk {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    return {
      accessToken: accessToken || '',
      refreshToken: refreshToken || '',
    };
  }

  setTokens(tokens: TokenBulk): void {
    const { accessToken, refreshToken } = tokens;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  refreshToken(): Observable<TokenBulk> {
    const { refreshToken } = this.getTokens();

    return from(
      this.apiService.post<TokenBulk>('token/refresh', {
        refresh_token: refreshToken,
      })
    ).pipe(
      tap((response) => {
        this.setTokens(response);
      }),
      catchError((error) => {
        this.clearTokens();
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
    this.clearTokens();
  }

  isAuthenticated() {
    return this.isAuthenticatedSignal();
  }
}
