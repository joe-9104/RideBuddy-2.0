import {Component, inject, OnInit} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, query, updateDoc, where} from '@angular/fire/firestore';
import {combineLatest, from, map, Observable, of, switchMap} from 'rxjs';
import {Ride} from '../../../app.models';
import {Auth, user} from '@angular/fire/auth';
import {AsyncPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-reservations-management',
  imports: [
    AsyncPipe,
    NgClass
  ],
  templateUrl: './reservations-management.html',
  styleUrl: './reservations-management.scss',
})
export class ReservationsManagement implements OnInit {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  reservations$: Observable<any[]> | undefined;

ngOnInit(): void {
  this.reservations$ = user(this.auth).pipe(
    switchMap(u => {
      if (!u) return [];

      const ridesQuery = query(
        collection(this.firestore, 'rides'),
        where('conductorId', '==', u.uid)
      );

      return collectionData(ridesQuery, { idField: 'id' }) as Observable<Ride[]>;
    }),
    switchMap(rides => {
      if (rides.length === 0) return of([]);

      // Pour chaque ride, récupérer les réservations
      const reservationsPerRide$ = rides.map(ride => {
        const reservationsQuery = query(
          collection(this.firestore, 'reservations'),
          where('rideId', '==', ride.id)
        );

        return collectionData(reservationsQuery, { idField: 'id' }).pipe(
          map(reservations => reservations.map(reservation => ({
            ...reservation,
            ride: ride // On ajoute directement l'objet ride complet
          })))
        );
      });

      return combineLatest(reservationsPerRide$).pipe(
        map(arraysOfReservations => arraysOfReservations.flat()) // On fusionne tous les tableaux
      );
    }),
    switchMap(reservations => {
      if (reservations.length === 0) return of([]);

      // Enrichir avec les données utilisateur
      const enrichedReservations$ = reservations.map(reservation => {
        if (!reservation.ride.conductorId) return of({ ...reservation, user: null });

        return from(getDoc(doc(this.firestore, 'users', reservation.ride.conductorId))).pipe(
          map(userSnap => ({
            ...reservation,
            user: userSnap.exists() ? userSnap.data() : null
          }))
        );
      });

      return combineLatest(enrichedReservations$);
    })
  );

  this.reservations$.subscribe(res => console.log('Reservations:', res));
}

  acceptReservation(reservationId: string) {
    const reservationRef = doc(this.firestore, 'reservations', reservationId);
    return from(updateDoc(reservationRef, { status: 'ACCEPTED' })).subscribe();
  }

  rejectReservation(reservationId: string) {
    const reservationRef = doc(this.firestore, 'reservations', reservationId);
    return from(updateDoc(reservationRef, { status: 'REJECTED' })).subscribe();
  }
}
