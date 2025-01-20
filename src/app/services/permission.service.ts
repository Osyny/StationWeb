import { Injectable } from '@angular/core';
import {
  PermissionCategoryClaims,
  PermissionDto,
} from '../models/account/permissions.dto';
import { UserStatusOnChangesService } from '../account/services/user-status-changed.service';
import { UserStoreService } from './user/user-store.service';
import { RoleEnum } from '../enums/role.enum';
import { UserService } from './user/user.service';
import { RoleSelectItem } from '../models/users/user-role.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  permissions?: PermissionCategoryClaims[];
  role?: RoleEnum;
  roles: RoleSelectItem[] = [];

  constructor(
    private userService: UserService,
    private _userStatusOnChangesService: UserStatusOnChangesService,
    private userStore: UserStoreService
  ) {
    this._userStatusOnChangesService.permissionDtoChanged$.subscribe((res) => {
      this.permissions = res;
    });
    this.userService.getRoles().subscribe((result) => {
      this.roles = result.roleSelectList;
    });
  }

  isCreateGranted(
    action: string,
    category: string,
    userRole?: string
  ): boolean {
    if (!this.roles?.find((r) => r.name === userRole)) {
      return false;
    }
    this.role = this.roles.find((r) => r.name === userRole)?.id;
    if (this.role && this.role === RoleEnum.Admin) {
      return true;
    }
    let isCategory: boolean = false;

    let isActionAny: boolean = false;
    const permissions = this.permissions as PermissionCategoryClaims[];
    for (let permission of permissions) {
      if (permission.Actions?.some((a) => a.Name === action)) {
        isActionAny = true;
        break;
      }
    }
    for (let permission of permissions) {
      if (permission.Name === category) {
        isCategory = true;
      }
      if (permission.Actions?.some((a) => a.Name === action)) {
        isActionAny = true;
      }
    }

    return isCategory && isActionAny;
  }
}
