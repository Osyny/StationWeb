import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../models/user-model';
import { UserStatusOnChangesService } from './services/user-status-changed.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent implements OnInit {
  user?: UserDto | null;
  isAuthorized: boolean = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _userStatusOnChangesService: UserStatusOnChangesService
  ) {
    this.authService.user?.subscribe((x) => {
      this.user = x;
      if (this.user) {
        this.router.navigateByUrl('/admin');
      }
    });
  }

  ngOnInit(): void {
    this._userStatusOnChangesService.isUserLoginChanged$.subscribe(
      (res) => (this.isAuthorized = res)
    );
  }
}
