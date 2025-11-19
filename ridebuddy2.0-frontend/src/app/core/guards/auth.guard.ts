import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth.service';
import {filter, map, switchMap, take} from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authReady$.pipe(
    filter((ready): ready is true => ready),
    switchMap(() => authService.user$.pipe(take(1))),
    map(user => {
      if (user) {
        console.log("user found", user);
        return true;
      }

      console.log("user not found");
      router.navigate(['/login']);
      return false;
    })
  );
};
