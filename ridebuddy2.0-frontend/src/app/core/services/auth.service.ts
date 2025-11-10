import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword, onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut, updateProfile,
} from '@angular/fire/auth';
import {Observable, from, BehaviorSubject} from 'rxjs';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {User} from '../../app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref = doc(this.firestore, `users/${firebaseUser.uid}`);
        const snap = await getDoc(ref);
        const userData = snap.exists() ? snap.data() as User : null;

        this.user$.next({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName ?? '',
          role: userData?.role ?? 'PASSENGER' // fallback
        });
      } else {
        this.user$.next(null);
      }
    });
  }

  async register(email: string, password: string, profile: any) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = userCredential.user;
    await updateProfile(userCredential.user, {
      displayName: `${profile.firstName} ${profile.lastName}`
    });
    await setDoc(doc(this.firestore, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      createdAt: new Date().toISOString()
    });
    return userCredential;
  }

  login(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }
}
