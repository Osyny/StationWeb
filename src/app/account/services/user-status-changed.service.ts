import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { PermissionDto } from '../../models/account/permissions.dto';

@Injectable({
  providedIn: 'root',
})
export class UserStatusOnChangesService {
  private isUserLoginChangedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  isUserLoginChanged$: Observable<boolean> =
    this.isUserLoginChangedSubject.asObservable();

  updateIsUserLoginChanged(isUserLoginChanged: boolean): void {
    this.isUserLoginChangedSubject.next(isUserLoginChanged);
  }

  //Permissions data
  private permissionDtoChangedSubject: BehaviorSubject<PermissionDto[]> =
    new BehaviorSubject<PermissionDto[]>([]);

  permissionDtoChanged$: Observable<PermissionDto[]> =
    this.permissionDtoChangedSubject.asObservable();

  updatePermissionDtoChanged(permissions: PermissionDto[]): void {
    this.permissionDtoChangedSubject.next(permissions);
  }
}
