import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, doc, docData, Firestore, setDoc} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {Ride} from '../../app.models';

@Injectable({ providedIn: 'root' })
export class RidesService {
  private firestore = inject(Firestore);

  // stream all rides
  getRides(): Observable<Ride[]> {
    const col = collection(this.firestore, 'rides');
    return collectionData(col, { idField: 'id' }) as Observable<Ride[]>;
  }

  // create new ride
  createRide(ride: Ride) {
    const col = collection(this.firestore, 'rides');
    return addDoc(col, { ...ride, createdAt: new Date() });
  }

  // get single ride
  getRide(id: string) {
    const docRef = doc(this.firestore, `rides/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Ride | undefined>;
  }

  // update (replace / set)
  setRide(id: string, data: Partial<Ride>) {
    const docRef = doc(this.firestore, `rides/${id}`);
    return setDoc(docRef, data, { merge: true });
  }
}
