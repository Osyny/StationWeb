import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  PermissionCategoryClaims,
  PermissionDto,
} from '../../models/account/permissions.dto';

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
  private permissionDtoChangedSubject: BehaviorSubject<
    PermissionCategoryClaims[]
  > = new BehaviorSubject<PermissionCategoryClaims[]>([]);

  permissionDtoChanged$: Observable<PermissionCategoryClaims[]> =
    this.permissionDtoChangedSubject.asObservable();

  updatePermissionDtoChanged(permissions: PermissionCategoryClaims[]): void {
    this.permissionDtoChangedSubject.next(permissions);
  }
}
