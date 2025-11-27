import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MapService} from '../../../core/services/map.service';
import {addDoc, collection, Firestore} from '@angular/fire/firestore';
import * as L from 'leaflet';
import {Router} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {filter} from 'rxjs';
import {Governorate} from '../../../app.models';

@Component({
  selector: 'app-create-ride',
  imports: [
    ReactiveFormsModule,
  ],
  templateUrl: './create-ride.html',
  styleUrl: './create-ride.scss',
})
export class CreateRide implements OnInit, AfterViewInit {
  rideForm!: FormGroup;
  instructions = 'Click on the map to select your start location.';
  currentStep: 'start' | 'end' = 'start';

  governorates = Object.values(Governorate);

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

    this.mapService.startCoordinates$.pipe(
      filter(coords => coords !== null)
    ).subscribe(coordinates => {
      this.mapService.getLocationInfo(coordinates).subscribe(location => {
        this.rideForm.patchValue({
          startCoordinate: `${coordinates.lng},${coordinates.lat}`,
          startGovernorate: location.governorate,
          departureLocation: location.name.split(',')[0],
        });
      });
    });

    this.mapService.endCoordinates$.pipe(
      filter(coords => coords !== null)
    ).subscribe(coordinates => {
      this.mapService.getLocationInfo(coordinates).subscribe(location => {
        this.rideForm.patchValue({
          startCoordinate: `${coordinates.lng},${coordinates.lat}`,
          endGovernorate: location.governorate,
          destination: location.name.split(',')[0],
        });
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
