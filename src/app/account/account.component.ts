import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserDto } from '../models/user-model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  user?: UserDto | null;
  constructor(private authService: AuthService, private router: Router) {
    this.authService.user?.subscribe((x) => (this.user = x));

    if (this.user) {
      this.router.navigateByUrl('/admin');
    }
  }
}
