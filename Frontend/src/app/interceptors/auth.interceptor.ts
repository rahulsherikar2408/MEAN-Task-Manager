import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();
    let authRequest = request;
    if (
      token &&
      !request.url.includes('/api/auth/login') &&
      !request.url.includes('/api/auth/signup')
    ) {
    authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error.status === 401 &&
            !request.url.includes('/api/auth/login') &&
            !request.url.includes('/api/auth/signup')
          ) {
            this.authService.clearAuthData();
            this.toastr.warning(
              'Your session has expired. Please login again.',
              'Session Expired',
            );
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        }),
      );
    }

    return next.handle(request);
  }
}
