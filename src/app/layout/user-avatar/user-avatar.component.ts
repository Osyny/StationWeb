import { Component, OnInit } from '@angular/core';

import { UserDisplayedDto } from '../dto/user-displayed.dto';
import { AuthService } from '../../services/auth.service';
import { UserStoreService } from '../../services/user/user-store.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss',
})
export class UserAvatarComponent implements OnInit {
  userName: string | undefined;
  role: string | undefined;
  loading: boolean = false;
  currentUser: UserDisplayedDto = new UserDisplayedDto();

  constructor(
    private authService: AuthService,
    private userStore: UserStoreService,
    private auth: AuthService
  ) {
    this.authService?.user?.subscribe((x) => {
      this.currentUser = x as UserDisplayedDto;
    });
  }
  ngOnInit(): void {
    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.userName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
    // this.userFullName = `${this.currentUser?.email}`;
  }

  // backToMyAccount() {
  //   this.clickBackToMyAccount.emit(true);
  // }
}
