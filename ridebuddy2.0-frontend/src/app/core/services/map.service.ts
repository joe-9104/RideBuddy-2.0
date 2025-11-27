import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

export interface LocationInfo {
  name: string;
  governorate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private startMarker: L.Marker | null = null;
  private endMarker: L.Marker | null = null;
  private routeLine: L.Polyline | null = null;

  private apiKey = environment.orsApiKey;

  startCoordinates$ = new BehaviorSubject<{ lat: number; lng: number } | null>(null);
  endCoordinates$ = new BehaviorSubject<{ lat: number; lng: number } | null>(null);

  map!: L.Map;

  constructor(private http: HttpClient) {}

  initMap(mapId: string, center: L.LatLngExpression = [36.8, 10.2], zoom = 7) {
    this.map = L.map(mapId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    return this.map;
  }

  private validateLatLng(coordinates: L.LatLng) {
    return coordinates.lat >= -90 && coordinates.lat <= 90 && coordinates.lng >= -180 && coordinates.lng <= 180;
  }

  getRoute(start: L.LatLng, end: L.LatLng) {
    if (!this.validateLatLng(start) || !this.validateLatLng(end)) return of(null);

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    return this.http.get<any>(url).pipe(
      catchError(() => of(null))
    );
  }

  drawRoute(start: L.LatLng, end: L.LatLng) {
    this.getRoute(start, end).subscribe(data => {
      if (!data?.features?.[0]) return;

      const coords = data.features[0].geometry.coordinates.map(
        (c: [number, number]) => [c[1], c[0]]
      );

      if (this.routeLine) this.map.removeLayer(this.routeLine);

      this.routeLine = L.polyline(coords, { color: 'blue', weight: 5 }).addTo(this.map);
      this.map.fitBounds(this.routeLine.getBounds());
    });
  }

  setMarker(markerPosition: L.LatLng, isStart: boolean) {
    if (isStart) {
      if (this.startMarker) this.map.removeLayer(this.startMarker);

      this.startMarker = L.marker(markerPosition, { draggable: true })
        .addTo(this.map)
        .bindPopup('Start Point')
        .openPopup();

      this.startCoordinates$.next(markerPosition);
    } else {
      if (this.endMarker) this.map.removeLayer(this.endMarker);

      this.endMarker = L.marker(markerPosition, { draggable: true })
        .addTo(this.map)
        .bindPopup('End Point')
        .openPopup();

      this.endCoordinates$.next(markerPosition);
    }

    if (this.startMarker && this.endMarker) {
      this.drawRoute(this.startMarker.getLatLng(), this.endMarker.getLatLng());
    }
  }

  resetMarker(isStart: boolean) {
    if (isStart && this.startMarker) {
      this.map.removeLayer(this.startMarker);
      this.startMarker = null;
      this.startCoordinates$.next(null);
    } else if (!isStart && this.endMarker) {
      this.map.removeLayer(this.endMarker);
      this.endMarker = null;
      this.endCoordinates$.next(null);
    }

    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }
  }

  getLocationInfo(coordinates: { lat: number; lng: number }) {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${this.apiKey}&point.lon=${coordinates.lng}&point.lat=${coordinates.lat}`;

    return this.http.get<any>(url).pipe(
      map(resp => {
        const props = resp?.features?.[0]?.properties || {};
        return {
          name: props.label ?? '',
          governorate: props.region ?? ''
        } as LocationInfo;
      }),
      catchError(() => of({ name: '', governorate: '' }))
    );
  }

}
