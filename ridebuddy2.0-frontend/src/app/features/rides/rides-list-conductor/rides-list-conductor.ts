import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Ride } from '../../../app.models';
import { Firestore, collection, collectionData, doc, updateDoc, query, where } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-rides-list-conductor',
  templateUrl: './rides-list-conductor.html',
  styleUrls: ['./rides-list-conductor.scss'],
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
export class RidesListConductor implements OnInit {

  protected filterColumn: string = '';
  protected filterValue: string = '';


  rides$: Observable<Ride[]> | undefined;

  constructor(private firestore: Firestore, private auth: Auth) {}

  ngOnInit() {
    user(this.auth).subscribe(currentUser => {
      if (!currentUser) return;

      const ridesQuery = query(
        collection(this.firestore, 'rides'),
        where('conductorId', '==', currentUser.uid)
      );

      this.rides$ = collectionData(ridesQuery, { idField: 'id' }) as Observable<Ride[]>;
    });
  }

  async cancelRide(ride: Ride) {
    if (!ride.id) return;
    await updateDoc(doc(this.firestore, `rides/${ride.id}`), { status: 'canceled' });
  }

  async markAsOver(ride: Ride) {
    if (!ride.id) return;
    await updateDoc(doc(this.firestore, `rides/${ride.id}`), { status: 'over' });
  }

  applyFilter() {
    // filtrage côté template via *ngFor + pipe
  }

  resetFilter() {
    this.filterColumn = '';
    this.filterValue = '';
  }
}
