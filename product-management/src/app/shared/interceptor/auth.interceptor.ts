import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt_token'); // Store your token here

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          'token': token // must match your FastAPI Header(...)
        }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          console.error('Unauthorized or Forbidden. Redirecting to login...');
          localStorage.removeItem('jwt_token');
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
