import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../core/services/map.service';
import {Ride, User} from '../../../app.models';
import {RidesService} from '../../../core/services/rides.service';
import {LatLng} from 'leaflet';
import {NgClass, CommonModule} from '@angular/common';
import {ReservationService} from '../../../core/services/reservations.service';
import {parseCoordinates} from '../../../utils/coordinates-parser';
import {Auth} from '@angular/fire/auth';

@Component({
  selector: 'app-ride-details',
  imports: [
    NgClass,
    CommonModule
  ],
  templateUrl: './ride-details.html',
})
export class RideDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private rideService = inject(RidesService);
  private mapService = inject(MapService);
  private reservationService = inject(ReservationService);
  private auth = inject(Auth);

  ride: Ride | undefined = undefined;
  conductor: User | null = null;

  hasReservation : string | null = null;

  rating: number = 0;
  isEvaluating : boolean = false;
  finishedRating: boolean = false;
  isReserving: boolean = false;

  private rideId!: string;
  private mapInitialized = false;

  constructor(private router: Router) {
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
    this.loadRide();
  }

  private loadRide() {
    this.rideService.getRideWithConductor(this.rideId).subscribe({
      next: result => {
        this.ride = result?.ride
        this.conductor = result?.conductor!!
        // Initialize map after ride data is loaded
        setTimeout(() => this.initMapIfReady(), 500);
      },
      error: err => {
        console.error('Could not load ride details:', err);
      }
    })
  }

  private initMapIfReady() {
    if (this.mapInitialized || !this.ride?.startCoordinate || !this.ride?.endCoordinate) return;

    this.mapService.initMap('map');

    const startCoords = parseCoordinates(this.ride.startCoordinate);
    this.mapService.setMarker(startCoords as LatLng, true);

    const endCoords = parseCoordinates(this.ride.endCoordinate);
    this.mapService.setMarker(endCoords as LatLng, false);

    this.mapInitialized = true;
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

  async makeReservation(seatsToReserve: number = 1): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser || !this.ride) {
      console.error('Cannot make reservation: User not authenticated or ride not loaded');
      alert('Please log in to make a reservation');
      return;
    }

    if (seatsToReserve < 1 || seatsToReserve > (this.ride.availablePlaces || 0)) {
      console.error('Invalid number of seats selected');
      alert('Please select a valid number of seats');
      return;
    }

    this.isReserving = true;

    try {
      const reservationRef = await this.reservationService.createReservation({
        rideId: this.ride.id!!,
        userId: currentUser.uid,
        reservedPlaces: seatsToReserve,
        status: 'PENDING'
      });

      this.hasReservation = reservationRef.id;
      console.log('Reservation created successfully:', reservationRef.id);
      alert('✓ Reservation created successfully!');
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      this.isReserving = false;
    }
  }
}


