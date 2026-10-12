import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { APP_URLS } from '../constants/route.constants';
import { AuthService } from '../services/auth.service';

/** Blocks pages for anonymous users and sends them to the login page. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? true : inject(Router).createUrlTree([APP_URLS.login]);
};

/** Keeps signed-in users away from the login page. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated() ? inject(Router).createUrlTree([APP_URLS.dashboard]) : true;
};
