import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MapService} from '../../../core/services/map.service';
import {addDoc, collection, Firestore} from '@angular/fire/firestore';
import {NgForOf} from '@angular/common';
import * as L from 'leaflet';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';

@Component({
  selector: 'app-create-ride',
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './create-ride.html',
  styleUrl: './create-ride.scss',
})
export class CreateRide implements OnInit, AfterViewInit {
  rideForm!: FormGroup;
  instructions = 'Click on the map to select your start location.';
  currentStep: 'start' | 'end' = 'start';

  governorates: string[] = [
    'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Zaghouan', 'Bizerte',
    'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia',
    'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabès', 'Médenine',
    'Tataouine', 'Gafsa', 'Tozeur', 'Kebili'
  ];

  constructor(
    private fb: FormBuilder,
    private mapService: MapService,
    private firestore: Firestore,
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.rideForm = this.fb.group({
      departureLocation: ['', Validators.required],
      startGovernorate: ['', Validators.required],
      departureDate: ['', Validators.required],
      departureTime: ['', Validators.required],
      destination: ['', Validators.required],
      endGovernorate: ['', Validators.required],
      availablePlaces: [1, Validators.required],
      pricePerSeat: [0, Validators.required],
      comments: [''],
      startCoordinate: [''],
      endCoordinate: [''],
      conductorId: [this.auth.userSubject.value?.uid, Validators.required],
      status: ['in-progress', Validators.required],
    });

    // Synchronisation carte -> formulaire
    this.mapService.startCoordinates$.subscribe(coord => {
      this.rideForm.patchValue({
        startCoordinate: coord ? `${coord.lng},${coord.lat}` : ''
      });
    });

    this.mapService.endCoordinates$.subscribe(coord => {
      this.rideForm.patchValue({
        endCoordinate: coord ? `${coord.lng},${coord.lat}` : ''
      });
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const map = this.mapService.initMap('map');

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (this.currentStep === 'start') {
          this.mapService.setMarker(e.latlng, true);
          this.instructions = 'Now click on the map to select your end location.';
          this.currentStep = 'end';
        } else {
          this.mapService.setMarker(e.latlng, false);
          this.instructions = 'Both locations selected! Adjust markers if needed.';
        }
      });
    }, 300);
  }

  resetStart() {
    this.mapService.resetMarker(true);
    this.currentStep = 'start';
    this.instructions = 'Click on the map to select your start location.';
  }

  resetEnd() {
    this.mapService.resetMarker(false);
    this.currentStep = 'end';
    this.instructions = 'Click on the map to select your end location.';
  }

  async submitRide() {
    if (this.rideForm.invalid) return;

    try {
      const ridesRef = collection(this.firestore, 'rides');
      await addDoc(ridesRef, this.rideForm.value);
      alert('Ride successfully created!');
      this.rideForm.reset();
      this.resetStart();
      this.resetEnd();
      this.router.navigate(['/dashboard']).then(() => console.log("ride successfully saved, redirection to dashboard..."));
    } catch (error) {
      console.error('Error creating ride:', error);
      alert('Failed to create ride.');
    }
  }
}
