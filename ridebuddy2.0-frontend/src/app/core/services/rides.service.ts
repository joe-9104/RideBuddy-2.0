import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, doc, docData, Firestore, setDoc} from '@angular/fire/firestore';
import {Observable, switchMap, of, map} from 'rxjs';
import {Ride, User} from '../../app.models';
import {UserService} from './user.service';

@Injectable({ providedIn: 'root' })
export class RidesService {
  private firestore = inject(Firestore);
  private userService = inject(UserService);

  // stream all rides
  getRides(): Observable<Ride[]> {
    const col = collection(this.firestore, 'rides');
    return collectionData(col, { idField: 'id' }) as Observable<Ride[]>;
  }

  // create a new ride
  createRide(ride: Ride) {
    const col = collection(this.firestore, 'rides');
    return addDoc(col, { ...ride, createdAt: new Date() });
  }

  // get a single ride
  getRide(id: string): Observable<Ride | undefined> {
    const docRef = doc(this.firestore, `rides/${id}`);
    return docData(docRef, { idField: 'id' }) as Observable<Ride | undefined>;
  }

  // update (replace / set)
  setRide(id: string, data: Partial<Ride>) {
    const docRef = doc(this.firestore, `rides/${id}`);
    return setDoc(docRef, data, { merge: true });
  }

  // get a ride with conductor details
  getRideWithConductor(id: string): Observable<{ ride: Ride; conductor: User | null } | undefined> {
    return this.getRide(id).pipe(
      switchMap(ride => {
        if (!ride || !ride.conductorId) {
          return of(undefined);
        }

        return this.userService.getUserByUid(ride.conductorId).pipe(
          map(conductor => ({
            ride,
            conductor
          }))
        );
      })
    );
  }
}
