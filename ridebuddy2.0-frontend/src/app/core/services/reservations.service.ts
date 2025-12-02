import {inject, Injectable} from '@angular/core';
import {collection, collectionData, doc, docData, Firestore, query, updateDoc, where} from '@angular/fire/firestore';
import {map, Observable, take} from 'rxjs';


@Injectable({ providedIn: 'root' })
export class ReservationService {
  private firestore = inject(Firestore);

  findReservationByRideId(rideId: string): Observable<any> {
    const reservationsCollection = collection(this.firestore, 'reservations');
    const q = query(
      reservationsCollection,
      where('rideId', '==' , rideId),
      where('status', '==', 'ACCEPTED')
    );
    return collectionData(q, { idField: 'uid' }).pipe(
      take(1),
      map(reservations => {
        const reservationArray = reservations as any[];
        return reservationArray.length > 0 ? reservationArray[0] as any : undefined;
      })
    );
  }

  evaluateConductor(uid: string, rating: number) {
    const ref = doc(this.firestore, 'reservations', uid);
    updateDoc(ref, {conductorRating: rating});
  }
}
