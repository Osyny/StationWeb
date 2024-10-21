import { Component } from '@angular/core';
import { UserDto } from './models/user-model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  user?: UserDto | null;
  isAuthorized: boolean = false;

  constructor(private authService: AuthService) {
    this.authService.user?.subscribe((x) => (this.user = x));
    this.isAuthorized = this.authService.isAuthorized;
  }
  title = 'ElectricStationWeb';
}
