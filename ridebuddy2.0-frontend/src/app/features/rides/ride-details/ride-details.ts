import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../core/services/map.service';
import {Ride, User} from '../../../app.models';
import {RidesService} from '../../../core/services/rides.service';
import {LatLng} from 'leaflet';
import {NgClass, CommonModule} from '@angular/common';
import {ReservationService} from '../../../core/services/reservations.service';
import {parseCoordinates} from '../../../utils/coordinates-parser';

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

  ride: Ride | undefined = undefined;
  conductor: User | null = null;

  hasReservation : string | null = null;

  rating: number = 0;
  isEvaluating : boolean = false;
  finishedRating: boolean = false;

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

  setRating(star: number): void {
    this.rating = star;
  }

  async submitRating(): Promise<void> {
    if (!this.hasReservation || !this.rating || this.isEvaluating) {
      console.error('Cannot submit rating: Missing reservation or rating');
      return;
    }

    this.isEvaluating = true;

    try {
      this.reservationService.evaluateConductor(this.hasReservation!!, this.rating);
      this.finishedRating = true;
      console.log('Evaluation submitted successfully');
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      this.isEvaluating = false;
    }
  }
}

