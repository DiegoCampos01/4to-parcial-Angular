import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthTokenService } from '../services/auth-token.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authTokenService: AuthTokenService,
    private router: Router,
    private location: Location
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authTokenService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authTokenService.clearAll();
          // Save current URL before redirecting
          const currentUrl = this.location.path();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: currentUrl }
          });
        }
        return throwError(() => error);
      })
    );
  }
} 