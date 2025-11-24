import {Component, inject} from '@angular/core';
import {collection, collectionData, doc, Firestore, query, setDoc, where} from '@angular/fire/firestore';
import {Auth, user} from '@angular/fire/auth';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {BehaviorSubject, Observable, of, switchMap} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-rides-list-passenger',
  imports: [NgForOf, NgIf, NgClass, AsyncPipe, FormsModule, RouterLink, FormsModule, NgForOf, AsyncPipe],
  templateUrl: './rides-list-passenger.html',
  styleUrl: './rides-list-passenger.scss',
})
export class RidesListPassenger {
private firestore = inject(Firestore);
  private auth = inject(Auth);
  private route = inject(ActivatedRoute);

  highlightRideId = '';

  filterColumn = '';
  filterValue = '';

  private ridesFullList = new BehaviorSubject<any[]>([]);
  rides$ = this.ridesFullList.asObservable();

  currentUser$ = user(this.auth);

  userReservations: string[] = [];

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.highlightRideId = params['highlightRideId'] || '';
    });

    // Load rides
    collectionData(collection(this.firestore, 'rides'), { idField: 'id' })
      .subscribe(rides => {
        this.ridesFullList.next(rides);
      });

    // Load reservations of current user
    this.currentUser$.pipe(
      switchMap(currentUser => {
        if (!currentUser) return of([]);
        const resQuery = query(
          collection(this.firestore, 'reservations'),
          where('userId', '==', currentUser.uid)
        );
        return collectionData(resQuery, { idField: 'id' }) as Observable<any[]>;
      })
    )
    .subscribe(reservations => {
      this.userReservations = reservations.map(r => r.rideId);
    });
  }

  // Populate dropdown values for the selected column
  getDistinctValuesForColumn(column: string): string[] {
    const values = new Set<string>();

    this.ridesFullList.value.forEach(ride => {
      const val = ride[column];
      if (val !== undefined && val !== null) {
        values.add(val.toString());
      }
    });

    return Array.from(values);
  }

  applyFilter() {
    if (!this.filterColumn || !this.filterValue) {
      this.ridesFullList.next(this.ridesFullList.value);
      return;
    }

    const filtered = this.ridesFullList.value.filter(r =>
      (r[this.filterColumn] ?? '').toString() === this.filterValue
    );

    this.ridesFullList.next(filtered);
  }

  resetFilter() {
    this.filterColumn = '';
    this.filterValue = '';
    collectionData(collection(this.firestore, 'rides'), { idField: 'id' })
      .subscribe(rides => this.ridesFullList.next(rides));
  }

  // Create new reservation
  async reserve(ride: any, places: number) {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    await setDoc(doc(collection(this.firestore, 'reservations')), {
      rideId: ride.id,
      userId: currentUser.uid,
      reservedPlaces: places,
      createdAt: new Date()
    });
  }
}
