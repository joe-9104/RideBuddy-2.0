import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser
} from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { doc, Firestore, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { User } from '../../app.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private initializedSubject = new BehaviorSubject<boolean>(false);
  authReady$ = this.initializedSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      await this.emitUserFromFirebase(firebaseUser);
      this.initializedSubject.next(true);
    });
  }

  private async emitUserFromFirebase(firebaseUser: FirebaseUser | null) {
    if (!firebaseUser) {
      this.userSubject.next(null);
      return;
    }

    const ref = doc(this.firestore, `users/${firebaseUser.uid}`);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as Partial<User>;
      this.userSubject.next({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? data.displayName ?? '',
        role: (data.role as User['role']) || 'PASSENGER',
        completedRides: data.completedRides || 0,
        averageRating: data.averageRating || 0,
        totalEarnings: data.totalEarnings || 0,
        createdAt: data.createdAt
      });
    } else {
      this.userSubject.next({
        uid: firebaseUser.uid,
        email: firebaseUser.email ?? '',
        displayName: firebaseUser.displayName ?? '',
        role: 'PASSENGER'
      });
    }
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

  async oauthSignIn(provider: GoogleAuthProvider | OAuthProvider) {
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;
    if (!user) return result;

    const ref = doc(this.firestore, `users/${user.uid}`);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const displayName = user.displayName ?? '';
      const [firstName, ...rest] = displayName.trim().split(' ');
      const lastName = rest.join(' ') || '';

      await setDoc(ref, {
        uid: user.uid,
        email: user.email ?? '',
        displayName,
        firstName,
        lastName,
        role: 'PASSENGER',
        createdAt: new Date().toISOString()
      });
    }

    return result;
  }

  async googleSignIn() {
    return this.oauthSignIn(new GoogleAuthProvider());
  }

  async microsoftSignIn() {
    return this.oauthSignIn(new OAuthProvider('microsoft.com'));
  }

  async logout() {
    await signOut(this.auth);
    return this.userSubject.next(null);
  }

  async updateDisplayName(newName: string) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    await updateProfile(currentUser, { displayName: newName });
    await setDoc(doc(this.firestore, 'users', currentUser.uid), { displayName: newName }, { merge: true });
    await this.emitUserFromFirebase(currentUser);
  }

  async updateUserRole(role: User['role']) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      throw new Error('User is not authenticated');
    }

    await updateDoc(doc(this.firestore, 'users', currentUser.uid), { role });
    await this.emitUserFromFirebase(currentUser);
  }
}
