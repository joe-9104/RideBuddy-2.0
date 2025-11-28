import {inject, Injectable} from '@angular/core';
import {doc, docData, Firestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {User} from '../../app.models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);

  getUserByUid(uid: string): Observable<User | null> {
    const ref = doc(this.firestore, 'users', uid);
    return docData(ref) as Observable<User | null>;
  }
}
