import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import {environment} from '../../../environment';
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

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

  initMap(mapId: string, center: L.LatLngExpression = [36.8, 10.2], zoom = 7) {
    this.map = L.map(mapId).setView(center, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    return this.map;
  }

  private isValidCoord(coord: L.LatLng) {
    return coord.lat >= -90 && coord.lat <= 90 && coord.lng >= -180 && coord.lng <= 180;
  }

  async fetchRoute(start: L.LatLng, end: L.LatLng) {
    if (!this.isValidCoord(start) || !this.isValidCoord(end)) return;

    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${this.apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`ORS API error: ${res.status}`);
      const data = await res.json();

      if (!data.features || !data.features[0]) return;

      const coords = data.features[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
      if (this.routeLine) this.map.removeLayer(this.routeLine);

      this.routeLine = L.polyline(coords, { color: 'blue', weight: 5 }).addTo(this.map);
      this.map.fitBounds(this.routeLine.getBounds());
    } catch (err) {
      console.error(err);
    }
  }

  setMarker(latlng: L.LatLng, isStart: boolean) {
    if (isStart) {
      if (this.startMarker) this.map.removeLayer(this.startMarker);
      this.startMarker = L.marker(latlng, { draggable: true })
        .addTo(this.map)
        .bindPopup('Start Point')
        .openPopup();
      this.startCoordinates$.next(latlng);
    } else {
      if (this.endMarker) this.map.removeLayer(this.endMarker);
      this.endMarker = L.marker(latlng, { draggable: true })
        .addTo(this.map)
        .bindPopup('End Point')
        .openPopup();
      this.endCoordinates$.next(latlng);
    }

    if (this.startMarker && this.endMarker) {
      this.fetchRoute(this.startMarker.getLatLng(), this.endMarker.getLatLng());
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

  async getLocationInfo(coord: { lat: number; lng: number }): Promise<{
    name: string;
    governorate: string;
  }> {
    const url = `https://api.openrouteservice.org/geocode/reverse?api_key=${this.apiKey}&point.lon=${coord.lng}&point.lat=${coord.lat}`;
    const res = await fetch(url);

    if (!res.ok) {
      return { name: '', governorate: '' };
    }

    const data = await res.json();
    const props = data.features?.[0]?.properties || {};

    return {
      name: props.label || '',
      governorate: props.region || ''
    };
  }


}
