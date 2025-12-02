import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../core/services/map.service';
import {Ride, User} from '../../../app.models';
import {RidesService} from '../../../core/services/rides.service';
import {UserService} from '../../../core/services/user.service';
import {LatLng} from 'leaflet';
import {NgClass} from '@angular/common';
import {ReservationService} from '../../../core/services/reservations.service';

@Component({
  selector: 'app-ride-details',
  imports: [
    NgClass
  ],
  templateUrl: './ride-details.html',
  styleUrl: './ride-details.css',
})
export class RideDetails implements OnInit {

  private route = inject(ActivatedRoute);
  private rideService = inject(RidesService);
  private userService = inject(UserService)
  private mapService = inject(MapService);
  private reservationService = inject(ReservationService);

  ride: Ride | undefined = undefined;
  conductor: User | null = null;

  hasReservation : string | null = null;

  rating: number = 0;
  isEvaluating : boolean = false;
  finishedRating: boolean = false;

  private rideId!: string;

  constructor(private router: Router) {
    const nav = this.router.currentNavigation();
    if (nav?.extras.state?.['hasReservation'] !== undefined) {
      this.hasReservation = nav.extras.state['hasReservation'];
      console.log("hasReservation extracted:", this.hasReservation);
    } else {
      console.log("no hasReservation");
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
    this.rideService.getRide(this.rideId).subscribe(ride => {
      console.log(ride);
      this.ride = ride;

      if (ride?.conductorId) {
        this.userService.getUserByUid(ride.conductorId).subscribe(user => {
          console.log(user);
          this.conductor = user;
        });
      }
      setTimeout(() => this.initMapIfReady(), 1000);
    });
  }

  private initMapIfReady() {
    if (!this.ride?.startCoordinate || !this.ride?.endCoordinate) return;

    this.mapService.initMap('map');

    const startCoords = this.parseCoordinates(this.ride.startCoordinate);
    this.mapService.setMarker(startCoords as LatLng, true);

    const endCoords = this.parseCoordinates(this.ride.endCoordinate);
    this.mapService.setMarker(endCoords as LatLng, false);
  }

  private parseCoordinates(coordinates: any): { lat: number, lng: number } {
    // Cas 1: coord est un string "lng,lat"
    if (typeof coordinates === 'string') {
      const [lng, lat] = coordinates.split(',').map(Number);
      return { lat, lng };
    }

    // Cas 2: coord est un tableau [lng, lat]
    if (Array.isArray(coordinates)) {
      return { lat: coordinates[1], lng: coordinates[0] };
    }

    // Cas 3: coord est déjà { lat, lng }
    if ('lat' in coordinates && 'lng' in coordinates) {
      return { lat: coordinates.lat, lng: coordinates.lng };
    }

    throw new Error('Invalid coordinate format');
  }

  setRating(star: number): void {
    this.rating = star;
  }

  async submitRating(): Promise<void> {
    if (!this.hasReservation || !this.rating || this.isEvaluating) {
      console.error('Reservation problem!');
      return;
    }

    this.isEvaluating = true;

    try {
      this.reservationService.evaluateConductor(this.hasReservation!!, this.rating);
      this.finishedRating = true;
      console.log('Evaluation success');
    } catch (error) {
      console.error('Evaluation error:', error);
    } finally {
      this.isEvaluating = false;
    }
  }
}
