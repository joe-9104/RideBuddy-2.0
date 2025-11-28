import { Component, inject } from '@angular/core';
import { Observable, BehaviorSubject, switchMap, of } from 'rxjs';
import { Ride } from '../../../app.models';
import { Firestore, collection, collectionData, doc, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-rides-list-conductor',
  templateUrl: './rides-list-conductor.html',
  styleUrls: ['./rides-list-conductor.css'],
  imports: [
    FormsModule,
    RouterLink,
    NgForOf,
    NgIf,
    AsyncPipe,
    NgClass
  ],
  standalone: true
})
export class RidesListConductor {
  protected filterColumn: string = '';
  protected filterValue: string = '';

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  currentUser$ = user(this.auth);

  private allRidesSubject = new BehaviorSubject<Ride[]>([]);
  rides$: Observable<Ride[]> = this.allRidesSubject.asObservable();

  constructor() {
    this.currentUser$.pipe(
      switchMap(currentUser => {
        if (!currentUser) return of([]);
        const ridesQuery = query(
          collection(this.firestore, 'rides'),
          where('conductorId', '==', currentUser.uid)
        );
        return collectionData(ridesQuery, { idField: 'id' }) as Observable<Ride[]>;
      })
    ).subscribe(rides => this.allRidesSubject.next(rides));
  }

  applyFilter() {
    const column = this.filterColumn;
    const value = this.filterValue.toLowerCase();

    if (!column || !value) {
      // si aucun filtre, on réaffiche tout
      this.currentUser$.pipe(
        switchMap(currentUser => {
          if (!currentUser) return of([]);
          const ridesQuery = query(
            collection(this.firestore, 'rides'),
            where('conductorId', '==', currentUser.uid)
          );
          return collectionData(ridesQuery, { idField: 'id' }) as Observable<Ride[]>;
        })
      ).subscribe(rides => this.allRidesSubject.next(rides));
      return;
    }

    const filtered = this.allRidesSubject.value.filter(ride => {
      const rideValue = (ride as any)[column];
      if (rideValue === undefined || rideValue === null) return false;
      return rideValue.toString().toLowerCase().includes(value);
    });

    this.allRidesSubject.next(filtered);
  }

  resetFilter() {
    this.filterColumn = '';
    this.filterValue = '';
    // recharge toutes les rides
    this.currentUser$.pipe(
      switchMap(currentUser => {
        if (!currentUser) return of([]);
        const ridesQuery = query(
          collection(this.firestore, 'rides'),
          where('conductorId', '==', currentUser.uid)
        );
        return collectionData(ridesQuery, { idField: 'id' }) as Observable<Ride[]>;
      })
    ).subscribe(rides => this.allRidesSubject.next(rides));
  }

  async cancelRide(ride: Ride) {
    if (!ride.id) return;
    await updateDoc(doc(this.firestore, `rides/${ride.id}`), { status: 'canceled' });
  }

  async markAsOver(ride: Ride) {
    if (!ride.id) return;
    await updateDoc(doc(this.firestore, `rides/${ride.id}`), { status: 'over' });
  }
}
