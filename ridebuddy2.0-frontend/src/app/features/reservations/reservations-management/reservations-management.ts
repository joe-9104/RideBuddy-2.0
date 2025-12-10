import {Component, inject, OnInit} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, query, updateDoc, where} from '@angular/fire/firestore';
import {combineLatest, from, map, Observable, of, switchMap} from 'rxjs';
import {Ride} from '../../../app.models';
import {AsyncPipe, NgClass} from '@angular/common';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-reservations-management',
  imports: [
    AsyncPipe,
    NgClass
  ],
  templateUrl: './reservations-management.html',
})
export class ReservationsManagement implements OnInit {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  reservations$: Observable<any[]> | undefined;

  ngOnInit(): void {
    this.reservations$ = this.authService.user$.pipe(
      switchMap(u => {
        if (!u) return [];

        const ridesQuery = query(
          collection(this.firestore, 'rides'),
          where('conductorId', '==', u.uid)
        );

        return collectionData(ridesQuery, {idField: 'id'}) as Observable<Ride[]>;
      }),
      switchMap(rides => {
        if (rides.length === 0) return of([]);

        // Pour chaque ride, récupérer les réservations
        const reservationsPerRide$ = rides.map(ride => {
          const reservationsQuery = query(
            collection(this.firestore, 'reservations'),
            where('rideId', '==', ride.id)
          );

          return collectionData(reservationsQuery, {idField: 'id'}).pipe(
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
          if (!reservation.ride.conductorId) return of({...reservation, user: null});

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
  }

  async acceptReservation(reservationId: string) {
    try {
      // Get the reservation to extract needed data
      const reservationRef = doc(this.firestore, 'reservations', reservationId);
      const reservationSnap = await getDoc(reservationRef);

      if (!reservationSnap.exists()) {
        console.error('Reservation not found');
        alert('Reservation not found');
        return;
      }

      const reservation = reservationSnap.data() as any;
      const reservedPlaces = reservation.reservedPlaces || 1;

      // Get the ride to check available places
      const rideRef = doc(this.firestore, 'rides', reservation.rideId);
      const rideSnap = await getDoc(rideRef);

      if (!rideSnap.exists()) {
        console.error('Ride not found');
        alert('Ride not found');
        return;
      }

      const ride = rideSnap.data() as any;
      const availablePlaces = ride.availablePlaces || 0;

      // Validate that there are enough available places
      if (availablePlaces <= 0) {
        console.warn('No available places on this ride');
        alert('❌ Cannot accept reservation: No available seats on this ride');
        return;
      }

      if (reservedPlaces > availablePlaces) {
        console.warn(`Not enough seats: requested ${reservedPlaces}, available ${availablePlaces}`);
        alert(`❌ Cannot accept reservation: Only ${availablePlaces} seat(s) available, but ${reservedPlaces} requested`);
        return;
      }

      // Update reservation status to ACCEPTED
      await updateDoc(reservationRef, { status: 'ACCEPTED' });

      // Decrement available places on the ride
      const newAvailablePlaces = availablePlaces - reservedPlaces;
      await updateDoc(rideRef, { availablePlaces: newAvailablePlaces });

      console.log(`Reservation ${reservationId} accepted. Ride seats decremented from ${availablePlaces} to ${newAvailablePlaces}`);
      alert(`✓ Reservation accepted! ${reservedPlaces} seat(s) reserved. ${newAvailablePlaces} seat(s) remaining.`);
    } catch (error) {
      console.error('Error accepting reservation:', error);
      alert('Failed to accept reservation. Please try again.');
    }
  }

  rejectReservation(reservationId: string) {
    const reservationRef = doc(this.firestore, 'reservations', reservationId);
    return from(updateDoc(reservationRef, {status: 'REJECTED'})).subscribe();
  }
}
