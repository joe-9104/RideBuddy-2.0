import {Component, inject, OnInit} from '@angular/core';
import {collection, collectionData, doc, Firestore, getDoc, query, updateDoc, where} from '@angular/fire/firestore';
import {Auth, user} from '@angular/fire/auth';
import {combineLatest, from, map, Observable, switchMap} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-passenger-reservations-history',
  imports: [
    FormsModule,
    NgIf,
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './passenger-reservations-history.html',
  styleUrl: './passenger-reservations-history.scss',
})
export class PassengerReservationsHistory implements OnInit {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  reservations$: Observable<any[]> | undefined;

  filterColumn = '';
  filterValue = '';

  ngOnInit() {
    this.reservations$ = user(this.auth).pipe(
      switchMap(u => {
        if (!u) return [];

        const reservationsQuery = query(
          collection(this.firestore, 'reservations'),
          where('userId', '==', u.uid)
        );

        return collectionData(reservationsQuery, { idField: 'id' }) as Observable<any[]>;
      }),

      // FUSION reservation + rideData
      switchMap(reservations => {
        const enriched$ = reservations.map(res =>
          from(getDoc(doc(this.firestore, 'rides', res.rideId))).pipe(
            map(rideSnap => ({
              ...res,
              ride: rideSnap.exists() ? rideSnap.data() : null
            }))
          )
        );

        return combineLatest(enriched$);
      })
    )
    this.reservations$.subscribe(res => console.log(res));
  }

  applyFilter(list: any[]) {
    if (!this.filterColumn || !this.filterValue) return list;

    return list.filter(item => {
      const value = item?.ride?.[this.filterColumn] ?? item[this.filterColumn];
      return value?.toString().toLowerCase().includes(this.filterValue.toLowerCase());
    });
  }

  async updateReservation(res: any, places: number) {
    await updateDoc(doc(this.firestore, 'reservations', res.id), {
      reservedPlaces: places
    });
  }

  resetFilter() {
    this.filterColumn = '';
    this.filterValue = '';
  }

  cancelReservation(res: any) {
    console.log(res);
  }
}
