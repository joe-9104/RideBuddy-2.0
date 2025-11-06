import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { user } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  private auth = inject(Auth);
  private router = inject(Router);

  canActivate() {
    return user(this.auth).pipe(
      take(1),
      map(u => {
        if (u) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
