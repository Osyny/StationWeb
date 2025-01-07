import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

import { UsersRolesResponse } from '../../models/users/user-role.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {}

  getRoles(): Observable<UsersRolesResponse> {
    let res = this.http.get<UsersRolesResponse>(`${this.apiUrl}/User/getRoles`);
    return res;
  }
}
