import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Check if user is authenticated and token is not expired
  if (authService.isAuthenticated() && !authService.isTokenExpired()) {
    return true;
  }

  // Try to refresh the token
  return authService.refreshAccessToken().pipe(
    map(() => {
      // After refresh, check if authenticated
      if (authService.isAuthenticated()) {
        return true;
      } else {
        return router.createUrlTree(['/auth']);
      }
    }),
    catchError(() => {
      // If refresh fails, redirect to login
      return of(router.createUrlTree(['/auth']));
    })
  );
};
