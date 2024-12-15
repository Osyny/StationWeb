import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CommonModule, DOCUMENT } from '@angular/common';
import { UserDto } from '../models/user-model';
import { environment } from '../../environments/environment.development';
import { AccountResponse } from '../models/account/account-response';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserStoreService } from './user/user-store.service';
import { UserStatusOnChangesService } from '../account/services/user-status-changed.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthorized: boolean = false;
  localStorage!: Storage | undefined;
  userSubject: BehaviorSubject<UserDto | null> | undefined;
  public user: Observable<UserDto | null> | undefined;

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly BEARER = 'Bearer';

  private apiUrl = `${environment.apiUrl}`;
  private userPayload: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private http: HttpClient,
    private cookie: CookieService,
    private userStore: UserStoreService,
    private _userStatusOnChangesService: UserStatusOnChangesService
  ) {
    const localStorage = document.defaultView?.localStorage;
    this.localStorage = localStorage;
    if (this.localStorage) {
      this.userSubject = new BehaviorSubject(
        JSON.parse(this.localStorage.getItem('currentUser')!)
      );
      this.user = this.userSubject.asObservable();

      let session = this.getToken();

      this.isAuthorized = session ? true : false;

      this.userPayload = this.decodedToken();
    }
  }

  getUserTokenAuth(
    email: string,
    password: string
  ): Observable<AccountResponse> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    let res = this.http.get<AccountResponse>(`${this.apiUrl}/Account/login`, {
      params,
    });

    res.subscribe((accountResponse) => {
      let r = accountResponse;
      let user = r.user;
      let token = r.token;

      if (user) {
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.cookie.set('test-cookies', token);
        this.userSubject?.next(user);
        this.user = this.userSubject?.asObservable();
      }
    });

    return res;
  }

  login(email: string, password: string): Observable<AccountResponse> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);

    let res = this.http.get<AccountResponse>(`${this.apiUrl}/Account/login`, {
      params,
    });

    return res;
  }

  logout() {
    const token = `Bearer ${localStorage.getItem('token')}`;

    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: token,
      }),
    };

    let res = this.http
      .get(`${this.apiUrl}/Account/logout`)
      .subscribe((res) => {
        this.removeStore();
      });
  }

  removeStore() {
    this._userStatusOnChangesService.updateIsUserLoginChanged(false);
    this.isAuthorized = false;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.cookie.delete('token');
    this.userSubject?.next(null);
    this.router.navigateByUrl('/');
  }

  setLocalData(response: AccountResponse) {
    if (response?.token) {
      let user = response?.user;
      let token = response?.token;
      this.isAuthorized = true;
      if (this.localStorage) {
        this.localStorage.setItem('currentUser', JSON.stringify(user));
        this.cookie.set('token', token);
        this.userSubject?.next(user);
        this.user = this.userSubject?.asObservable();
      }
    }
  }

  get existCookie() {
    let cookies = this.cookie.get('token');
    let res: boolean = !cookies ? false : true;

    return res;
  }

  getToken() {
    if (this.localStorage) {
      return this.localStorage.getItem('token');
    }
    return null;
  }
  storeToken(tokenValue: string) {
    if (this.localStorage) {
      this.localStorage.setItem('token', tokenValue);
    }
  }
  storeRefreshToken(tokenValue: string) {
    if (this.localStorage) {
      this.localStorage.setItem('refreshToken', tokenValue);
    }
  }

  getRefreshToken() {
    if (this.localStorage) {
      return this.localStorage.getItem('refreshToken');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token));
    return jwtHelper.decodeToken(token);
  }

  getfullNameFromToken() {
    if (this.userPayload) return this.userPayload.userName;
  }

  getRoleFromToken() {
    if (this.userPayload) return this.userPayload.role;
  }
}
