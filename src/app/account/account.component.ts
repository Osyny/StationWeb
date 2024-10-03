import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  isAuthenticated: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthorized) {
      this.router.navigateByUrl('/admin');
    }
  }
}
