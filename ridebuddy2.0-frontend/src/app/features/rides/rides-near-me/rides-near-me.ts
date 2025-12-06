import { Component, OnDestroy, OnInit } from '@angular/core';
import { DecimalPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faArrowRightLong,
  faClock,
  faLocationDot,
  faUsers
} from '@fortawesome/free-solid-svg-icons';
import { Ride } from '../../../app.models';
import { RidesService } from '../../../core/services/rides.service';
import { Subject, takeUntil } from 'rxjs';

interface NearbyRide {
  ride: Ride;
  distanceKm: number;
  coords: { lat: number; lng: number };
}

@Component({
  selector: 'app-rides-near-me',
  imports: [NgForOf, NgIf, RouterLink, FaIconComponent, DecimalPipe],
  templateUrl: './rides-near-me.html',
  styleUrl: './rides-near-me.css',
})
export class RidesNearMe implements OnInit, OnDestroy {
  selectedRadius = 25;
  nearbyRides: NearbyRide[] = [];
  loading = true;
  currentLocation: { lat: number; lng: number } | null = null;
  errorMessage = '';
  heroRide: NearbyRide | null = null;

  private destroy$ = new Subject<void>();
  private ridesCache: Ride[] = [];

  protected readonly faLocationDot = faLocationDot;
  protected readonly faClock = faClock;
  protected readonly faUsers = faUsers;
  protected readonly faArrowRightLong = faArrowRightLong;

  constructor(private ridesService: RidesService) {}

  ngOnInit() {
    this.ridesService
      .getRides()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: rides => {
          this.ridesCache = rides;
          this.filterRides();
        },
        error: () => {
          this.errorMessage = 'Unable to load rides at the moment.';
          this.loading = false;
        }
      });

    this.requestLocation();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get averageDistance(): number {
    if (!this.nearbyRides.length) return 0;
    const sum = this.nearbyRides.reduce((acc, item) => acc + item.distanceKm, 0);
    return sum / this.nearbyRides.length;
  }

  updateRadius(value: string) {
    this.selectedRadius = Number(value);
    this.filterRides();
  }

  private requestLocation() {
    if (!navigator.geolocation) {
      this.errorMessage = 'Geolocation is not available on this browser.';
      this.loading = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.loading = false;
        this.filterRides();
      },
      () => {
        this.errorMessage = 'Location access denied. Showing the most recent nearby rides.';
        this.loading = false;
        this.filterRides();
      },
      { enableHighAccuracy: true }
    );
  }

  private filterRides() {
    if (!this.currentLocation) {
      this.nearbyRides = [];
      this.heroRide = null;
      return;
    }

    const mapped = this.ridesCache
      .map(ride => {
        const coords = this.parseCoordinates(ride.startCoordinate);
        if (!coords) return null;
        const distance = this.haversineDistance(coords, this.currentLocation!);
        return { ride, distanceKm: distance, coords };
      });

    const filtered = mapped.filter((item): item is NearbyRide => item !== null && item.distanceKm <= this.selectedRadius);
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);

    this.nearbyRides = filtered;
    this.heroRide = filtered[0] ?? null;
  }

  private parseCoordinates(value?: string): { lat: number; lng: number } | null {
    if (!value) return null;
    const parts = value.split(',').map(part => Number(part.trim()));
    if (parts.length !== 2) return null;
    const [lng, lat] = parts;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  private haversineDistance(pointA: { lat: number; lng: number }, pointB: { lat: number; lng: number }) {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(pointB.lat - pointA.lat);
    const dLng = toRad(pointB.lng - pointA.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(pointA.lat)) * Math.cos(toRad(pointB.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  }
}
