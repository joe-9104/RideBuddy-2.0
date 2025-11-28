import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {doc, Firestore, getDoc} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {MapService} from '../../../core/services/map.service';
import {Ride} from '../../../app.models';
import {LatLng} from 'leaflet';

@Component({
  selector: 'app-ride-visualize',
  imports: [],
  templateUrl: './ride-visualize.html',
  styleUrl: './ride-visualize.css',
})
export class RideVisualize implements OnInit, AfterViewInit {
  private firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private mapService = inject(MapService);

  ride: Ride | null = null;

  async ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['ride']) {
      this.ride = navigation.extras.state['ride'];
    } else {
      // Sinon, récupérer depuis Firestore avec l'ID
      const rideId = this.route.snapshot.paramMap.get('id');
      if (!rideId) return;
      const rideSnap = await getDoc(doc(this.firestore, 'rides', rideId));
      if (!rideSnap.exists()) return;
      this.ride = { id: rideSnap.id, ...rideSnap.data() } as Ride;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.ride?.startCoordinate || !this.ride?.endCoordinate) return;

      // 2️⃣ Initialiser la carte via le service
      this.mapService.initMap('map');

      // 3️⃣ Placer les marqueurs et tracer la route via le service
      if (this.ride.startCoordinate) {
        const startCoords = this.parseCoord(this.ride.startCoordinate);
        this.mapService.setMarker(startCoords as LatLng, true);
      }

      if (this.ride.endCoordinate) {
        const endCoords = this.parseCoord(this.ride.endCoordinate);
        this.mapService.setMarker(endCoords as LatLng, false);
      }
    }, 1000)

  }

  private parseCoord(coord: any): { lat: number, lng: number } {
    // Cas 1: coord est un string "lng,lat"
    if (typeof coord === 'string') {
      const [lng, lat] = coord.split(',').map(Number);
      return { lat, lng };
    }

    // Cas 2: coord est un tableau [lng, lat]
    if (Array.isArray(coord)) {
      return { lat: coord[1], lng: coord[0] };
    }

    // Cas 3: coord est déjà { lat, lng }
    if ('lat' in coord && 'lng' in coord) {
      return { lat: coord.lat, lng: coord.lng };
    }

    throw new Error('Invalid coordinate format');
  }
}
