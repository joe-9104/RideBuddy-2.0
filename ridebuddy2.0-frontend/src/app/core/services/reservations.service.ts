import {inject, Injectable} from '@angular/core';
import {addDoc, collection, collectionData, doc, Firestore, query, updateDoc, where} from '@angular/fire/firestore';
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

  async createReservation(reservationData: {
    rideId: string;
    userId: string;
    reservedPlaces: number;
    status: string;
  }) {
    const reservationsCollection = collection(this.firestore, 'reservations');
    return await addDoc(reservationsCollection, {
      ...reservationData,
      createdAt: new Date(),
      conductorRating: null
    });
  }

  async evaluateConductor(uid: string, rating: number): Promise<void> {
    const ref = doc(this.firestore, 'reservations', uid);
    return await updateDoc(ref, { conductorRating: rating });
  }
}


