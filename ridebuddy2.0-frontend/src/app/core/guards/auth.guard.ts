import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {filter, map, switchMap, take} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    filter((ready): ready is true => ready),
    switchMap(() => authService.userSubject.pipe(take(1))),
    map(user => {
      if (user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  );
};
