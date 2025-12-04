import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword, onAuthStateChanged,
  signInWithEmailAndPassword, signInWithPopup,
  signOut, updateProfile, GoogleAuthProvider
} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';
import {doc, Firestore, getDoc, setDoc} from '@angular/fire/firestore';
import {User} from '../../app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private initializedSubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.initializedSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.userSubject.next(null);
        this.initializedSubject.next(true);
        return;
      }

      const ref = doc(this.firestore, `users/${firebaseUser.uid}`);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data() as Partial<User>;
        this.userSubject.next({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName ?? '',
          role: (data.role as 'CONDUCTOR' | 'PASSENGER') || 'PASSENGER',
          completedRides: data.completedRides || 0,
          averageRating: data.averageRating || 0,
          totalEarnings: data.totalEarnings || 0
        });
      } else {
        // fallback si le document n'existe pas
        this.userSubject.next({
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName ?? '',
          role: 'PASSENGER'
        });
      }
      this.initializedSubject.next(true);
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

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async googleSignIn() {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(this.auth, provider)
  }

  logout() {
    return signOut(this.auth).then(() => this.userSubject.next(null));
  }
}
