import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {filter, map, switchMap, take} from 'rxjs';

export const landingGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    filter((ready): ready is true => ready),
    switchMap(() => authService.userSubject.pipe(take(1))),
    map(user => {
      if (user) {
        router.navigate(['/dashboard']);
      }
      return true;
    })
  );
};
