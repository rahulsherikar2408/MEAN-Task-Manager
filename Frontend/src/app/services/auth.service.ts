import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from '../models/auth';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) {}

  signup(data: SignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/signup`, data).pipe(
      tap((response) => {
        this.saveAuthData(response);
      }),
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, data).pipe(
      tap((response) => {
        this.saveAuthData(response);
      }),
    );
  }

  private saveAuthData(response: AuthResponse) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }

  logout(): void {
    this.clearAuthData();
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): User | null {
    const user = localStorage.getItem('user');

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
