import { Router } from '@angular/router';

import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getToken();
    const existCookie = this.authService.existCookie;

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }, // "Bearer "+myToken
      });
    }

    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || !existCookie) {
            if (err) {
              this.toastr.warning(err.message, 'Warning');
            } else {
              this.toastr.warning(
                'Token is expired, Please Login again',
                'Warning'
              );
            }

            this.authService.removeStore();
            this.router.navigateByUrl('/');
            // handle
            // return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => err);
      })
    );
  }
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    // let tokeApiModel = new TokenApiModel();
    // tokeApiModel.accessToken = this.auth.getToken()!;
    // tokeApiModel.refreshToken = this.auth.getRefreshToken()!;
    // return this.auth.renewToken(tokeApiModel).pipe(
    //   switchMap((data: TokenApiModel) => {
    //     this.auth.storeRefreshToken(data.refreshToken);
    //     this.auth.storeToken(data.accessToken);
    //     req = req.clone({
    //       setHeaders: { Authorization: `Bearer ${data.accessToken}` }, // "Bearer "+myToken
    //     });
    //     return next.handle(req);
    //   }),
    //   catchError((err) => {
    //     return throwError(() => {
    //       this.toast.warning({
    //         detail: 'Warning',
    //         summary: 'Token is expired, Please Login again',
    //       });
    //       this.router.navigate(['login']);
    //     });
    //   })
    // );
  }

  // return next.handle(request).pipe(
  //   tap(
  //     () => {},
  //     (err: any) => {
  //       if (err instanceof HttpErrorResponse) {
  //         if (err.status !== 401) {
  //           return;
  //         }
  //         //  this.authService.logout();
  //         this.router.navigateByUrl('/');
  //       }
  //     }
  //   )
  // );
}
