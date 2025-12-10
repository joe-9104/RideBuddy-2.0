import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, of, switchMap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PassengerStatsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  getPassengerStats() {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || user.role !== 'PASSENGER') return of(null);
        return this.loadStatsForPassenger(user.uid);
      })
    );
  }

  // make a public wrapper so other services can request stats for an arbitrary passenger id
  getStatsForPassenger(passengerId: string) {
    return this.loadStatsForPassenger(passengerId);
  }

  private loadStatsForPassenger(passengerId: string) {
    const reservationsRef = collection(this.firestore, 'reservations');
    const reservationsQuery = query(reservationsRef, where('userId', '==', passengerId));

    return from(getDocs(reservationsQuery)).pipe(
      map(reservationsSnap => {
        const reservations = reservationsSnap.docs.map(d => d.data() as any);

        const acceptedReservations = reservations.filter(r => r.status === 'ACCEPTED');

        return {
          totalReservations: reservations.length,
          acceptedReservations: acceptedReservations.length,
          ridesTaken: acceptedReservations.length
        };
      })
    );
  }
}
