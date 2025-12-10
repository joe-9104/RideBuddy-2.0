import {Component, inject, OnInit, NgZone} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../core/services/map.service';
import {Ride, User} from '../../../app.models';
import {RidesService} from '../../../core/services/rides.service';
import {LatLng} from 'leaflet';
import {NgClass, CommonModule} from '@angular/common';
import {ReservationService} from '../../../core/services/reservations.service';
import {parseCoordinates} from '../../../utils/coordinates-parser';
import {AuthService} from '../../../core/services/auth.service';
import {collection, collectionData, query, where} from '@angular/fire/firestore';
import {map, take} from 'rxjs';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-ride-details',
  imports: [
    NgClass,
    CommonModule,
    FormsModule,
    FormsModule
  ],
  templateUrl: './ride-details.html',
})
export class RideDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private rideService = inject(RidesService);
  private mapService = inject(MapService);
  private reservationService = inject(ReservationService);
  private authService = inject(AuthService);
  private ngZone = inject(NgZone);
  private router = inject(Router);

  ride: Ride | undefined = undefined;
  conductor: User | null = null;

  hasReservation : string | null = null;
  selectedSeats: number = 1;

  rating: number = 0;
  isEvaluating : boolean = false;
  finishedRating: boolean = false;
  isReserving: boolean = false;
  isLoading: boolean = true;
  loadingError: string | null = null;

  private rideId!: string;
  private mapInitialized = false;

  constructor() {
    const nav = this.router.currentNavigation();
    if (nav?.extras.state?.['hasReservation'] !== undefined) {
      this.hasReservation = nav.extras.state['hasReservation'];
    }

    if(nav?.extras.state?.['conductorRating'] !== undefined) {
      this.rating = nav.extras.state['conductorRating'];
    }
  }

  ngOnInit() {
    this.rideId = this.route.snapshot.paramMap.get('id')!;
    if (!this.rideId) {
      this.loadingError = 'No ride ID provided';
      this.isLoading = false;
      return;
    }
    this.loadRide();
  }

  private loadRide() {
    this.isLoading = true;
    this.loadingError = null;

    this.ngZone.run(() => {
      this.rideService.getRideWithConductor(this.rideId).subscribe({
        next: result => {
          this.ngZone.run(() => {
            this.ride = result?.ride;
            this.conductor = result?.conductor || null;
            this.isLoading = false;

            // Check if user has an existing reservation for this ride
            this.checkExistingReservation();

            // Initialize map after ride data is loaded
            setTimeout(() => this.initMapIfReady(), 500);
          });
        },
        error: err => {
          this.ngZone.run(() => {
            console.error('Could not load ride details:', err);
            this.loadingError = 'Failed to load ride details. Please try again.';
            this.isLoading = false;
          });
        }
      });
    });
  }

  private checkExistingReservation() {
    const currentUser = this.authService.userSubject.value;
    if (!currentUser || !this.ride?.id) {
      this.hasReservation = null;
      return;
    }

    // Query for existing reservations by this user for this ride
    const db = this.rideService['firestore']; // Access firestore from service
    const reservationsRef = collection(db, 'reservations');
    const q = query(
      reservationsRef,
      where('userId', '==', currentUser.uid),
      where('rideId', '==', this.ride.id)
    );

    collectionData(q, { idField: 'id' }).pipe(
      take(1),
      map((reservations: any[]) => {
        // Find any non-rejected reservation
        return reservations.find(r => r.status !== 'REJECTED') || null;
      })
    ).subscribe({
      next: (reservation) => {
        this.hasReservation = reservation?.id || null;
        if (reservation) {
          this.rating = reservation.conductorRating || 0;
        }
      },
      error: (err) => {
        console.error('Error checking existing reservation:', err);
      }
    });
  }

  private initMapIfReady() {
    if (this.mapInitialized || !this.ride?.startCoordinate || !this.ride?.endCoordinate) return;

    try {
      this.mapService.initMap('map');

      const startCoords = parseCoordinates(this.ride.startCoordinate);
      this.mapService.setMarker(startCoords as LatLng, true);

      const endCoords = parseCoordinates(this.ride.endCoordinate);
      this.mapService.setMarker(endCoords as LatLng, false);

      this.mapInitialized = true;
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }

  setRating(star: number) {
    this.rating = star;
  }

  async submitRating(): Promise<void> {
    if (!this.hasReservation || !this.rating || this.isEvaluating) {
      console.error('Cannot submit rating: Missing reservation or rating');
      return;
    }

    this.isEvaluating = true;

    try {
      await this.reservationService.evaluateConductor(this.hasReservation!!, this.rating);
      this.finishedRating = true;
      console.log('Evaluation submitted successfully');

      // Reset message after 3 seconds
      setTimeout(() => {
        this.finishedRating = false;
      }, 3000);
    } catch (error) {
      console.error('Evaluation error:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      this.isEvaluating = false;
    }
  }

  async reserveSeats(): Promise<void> {
    const currentUser = this.authService.userSubject.value;
    if (!currentUser || !this.ride) {
      console.error('Cannot make reservation: User not authenticated or ride not loaded');
      alert('Please log in to make a reservation');
      return;
    }

    if (this.selectedSeats < 1 || this.selectedSeats > (this.ride.availablePlaces || 0)) {
      console.error('Invalid number of seats selected');
      alert('Please select a valid number of seats');
      return;
    }

    this.isReserving = true;

    try {
      const reservationRef = await this.reservationService.createReservation({
        rideId: this.ride.id!!,
        userId: currentUser.uid,
        reservedPlaces: this.selectedSeats,
        status: 'PENDING'
      });

      this.hasReservation = reservationRef.id;
      console.log('Reservation created successfully:', reservationRef.id);
      alert(`✓ Reservation created successfully! You reserved ${this.selectedSeats} seat(s).`);

      // Reset seat selection
      this.selectedSeats = 1;
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      this.isReserving = false;
    }
  }
}
