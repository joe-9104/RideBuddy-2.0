import { Component, Input, Output, EventEmitter, AfterViewInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Ride } from '../../../app.models';
import * as L from 'leaflet';
import {UserService} from '../../../core/services/user.service';

@Component({
  selector: 'app-ride-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './ride-card.html',
})
export class RideCardComponent implements AfterViewInit {
  private userService = inject(UserService);

  @Input() ride!: Ride;
  @Input() highlightRideId: string = '';
  @Input() isReserved: boolean = false;
  @Input() conductorName: string = 'Unknown';

  @Output() reserve = new EventEmitter<{ ride: Ride; places: number }>();
  @Output() viewDetails = new EventEmitter<Ride>();

  private mapInitialized = false;

  ngAfterViewInit() {
    this.fetchConductorName();
    setTimeout(() => this.initMap(), 100);
  }

  private fetchConductorName() {
    if (!this.ride?.id || !this.ride?.conductorId) return;

    this.userService.getUserByUid(this.ride.conductorId).subscribe({
      next: (data) => {
        if (data?.displayName) {
          this.conductorName = data.displayName;
        }
      },
      error: (err) => {
        console.warn(`Could not fetch conductor name for ride ${this.ride.id}:`, err);
      }
    });
  }

  private initMap() {
    if (this.mapInitialized || !this.ride?.id) return;

    const mapId = `map-${this.ride.id}`;
    const mapElement = document.getElementById(mapId);

    if (!mapElement) return;

    try {
      this.createAndDrawMap(mapId);
      this.mapInitialized = true;
    } catch (error) {
      console.error(`Error initializing map for ride ${this.ride.id}:`, error);
    }
  }

  private createAndDrawMap(mapId: string) {
    const defaultCenter = [36.8, 10.2] as [number, number];

    // Destroy existing map if it exists
    const existingElement = document.getElementById(mapId);
    if (existingElement && (existingElement as any)._leaflet_map) {
      (existingElement as any)._leaflet_map.remove();
    }

    // Create new map
    const map = L.map(mapId).setView(defaultCenter, 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Draw route if coordinates exist
    if (this.ride?.startCoordinate && this.ride?.endCoordinate) {
      const startCoords = this.parseCoordinates(this.ride.startCoordinate);
      const endCoords = this.parseCoordinates(this.ride.endCoordinate);
      this.drawRoute(map, startCoords, endCoords);
    }
  }

  private drawRoute(map: any, startCoords: any, endCoords: any) {
    // Add start marker
    L.marker([startCoords.lat, startCoords.lng], { title: 'Start' })
      .addTo(map)
      .bindPopup('Start Point')
      .openPopup();

    // Add end marker
    L.marker([endCoords.lat, endCoords.lng], { title: 'End' })
      .addTo(map)
      .bindPopup('End Point');

    // Draw route line
    const routeCoordinates: [number, number][] = [
      [startCoords.lat, startCoords.lng],
      [endCoords.lat, endCoords.lng]
    ];

    L.polyline(routeCoordinates, {
      color: '#10b981',
      weight: 3,
      opacity: 0.8,
      dashArray: '5, 10'
    }).addTo(map);

    // Fit map to bounds
    const bounds = L.latLngBounds([
      [startCoords.lat, startCoords.lng],
      [endCoords.lat, endCoords.lng]
    ]);
    map.fitBounds(bounds, { padding: [50, 50] });
  }

  private parseCoordinates(coordinates: any): { lat: number; lng: number } {
    // Case 1: coordinate is a string "lng,lat"
    if (typeof coordinates === 'string') {
      const [lng, lat] = coordinates.split(',').map(Number);
      return { lat, lng };
    }

    // Case 2: coordinate is an array [lng, lat]
    if (Array.isArray(coordinates)) {
      return { lat: coordinates[1], lng: coordinates[0] };
    }

    // Case 3: coordinate is already { lat, lng }
    if ('lat' in coordinates && 'lng' in coordinates) {
      return { lat: coordinates.lat, lng: coordinates.lng };
    }

    throw new Error('Invalid coordinate format');
  }

  onReserve(places: number) {
    this.reserve.emit({ ride: this.ride, places });
  }

  onViewDetails() {
    this.viewDetails.emit(this.ride);
  }
}

