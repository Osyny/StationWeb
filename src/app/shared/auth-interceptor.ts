import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  localStorage!: Storage | undefined;

  constructor(private router: Router) {
    const localStorage = document.defaultView?.localStorage;
    this.localStorage = localStorage;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.localStorage = localStorage;
    if (this.localStorage) {
      const currentUser = JSON.parse(this.localStorage.getItem('currentUser')!);
      if (currentUser && currentUser.token) {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${currentUser.token}`,
          },
        });
      }
    }

    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.router.navigate(['login']);
          }
        }
      )
    );
  }
}

// import { Injectable } from '@angular/core';
// import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

// import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, filter, take, switchMap } from 'rxjs/operators';
// import { AuthService } from '../services/auth.service';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {

//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(public authService: AuthService) { }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

//     if (this.authService.getJwtToken()) {
//       request = this.addToken(request, this.authService.getJwtToken()!);
//     }

//     return next.handle(request).pipe(catchError(error => {
//       if (error instanceof HttpErrorResponse && error.status === 401) {
//         return this.handle401Error(request, next);
//       } else {
//         return throwError(error);
//       }
//     }));
//   }

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         'Authorization': `Bearer ${token}`
//       }
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshToken().pipe(
//         switchMap((token: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(token.jwt);
//           return next.handle(this.addToken(request, token.jwt));
//         }));

//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(jwt => {
//           return next.handle(this.addToken(request, jwt));
//         }));
//     }
//   }
// }
