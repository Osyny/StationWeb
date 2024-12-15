import { Component, OnInit } from '@angular/core';
import { UserDto } from './models/user-model';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UserStatusOnChangesService } from './account/services/user-status-changed.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  user?: UserDto | null;
  isAuthorized$?: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _userStatusOnChangesService: UserStatusOnChangesService
  ) {
    this.authService.user?.subscribe((x) => {
      this.user = x;
      _userStatusOnChangesService.updateIsUserLoginChanged(this.user != null);
      if (this.user) {
        // this.router.navigateByUrl('/admin');
      }
    });
  }
  title = 'ElectricStationWeb';

  ngOnInit(): void {
    this.isAuthorized$ = this._userStatusOnChangesService.isUserLoginChanged$;
  }
}
