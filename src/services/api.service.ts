import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export type HttpClientOptions = Parameters<HttpClient['get']>[1];

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return lastValueFrom(this.http.get<T>(url, options));
  }

  post<T>(
    endpoint: string,
    body: any | null,
    options?: HttpClientOptions
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return lastValueFrom(this.http.post<T>(url, body, options));
  }

  put<T>(
    endpoint: string,
    body: any | null,
    options?: HttpClientOptions
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return lastValueFrom(this.http.put<T>(url, body, options));
  }

  patch<T>(
    endpoint: string,
    body: any,
    options?: HttpClientOptions
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return lastValueFrom(this.http.patch<T>(url, body, options));
  }

  delete<T>(endpoint: string, options?: HttpClientOptions): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    return lastValueFrom(this.http.delete<T>(url, options));
  }
}
