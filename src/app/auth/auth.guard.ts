import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let r = route;

  if (inject(AuthService).isAuthorized) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};
