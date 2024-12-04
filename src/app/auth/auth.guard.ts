import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  let r = route;
  if (inject(AuthService).user) {
    return true;
  }
  inject(Router).navigateByUrl('/');
  return false;
};
