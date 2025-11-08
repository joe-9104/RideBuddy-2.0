// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, updateProfile,
  user,
  User
} from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  // user$ : Observable<User | null>
  user$ = user(this.auth);

  async register(email: string, password: string, profile: any) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(userCredential.user, {
      displayName: `${profile.firstName} ${profile.lastName}`
    });
    return userCredential;
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  // utility: get current idToken as Observable<string|null>
  getIdToken$(): Observable<string | null> {
    return this.user$.pipe(
      take(1),
      switchMap(u => (u ? from(u.getIdToken()) : of(null)))
    );
  }
}
