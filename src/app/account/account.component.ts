import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  isAuthorized: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    this.isAuthorized = this.authService.isAuthorized;
    if (this.isAuthorized) {
      this.router.navigateByUrl('/admin');
    }
  }
}
