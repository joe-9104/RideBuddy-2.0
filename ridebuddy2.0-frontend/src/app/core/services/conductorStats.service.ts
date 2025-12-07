import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { from, of, switchMap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConductorStatsService {

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) { }

  getConductorStats() {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (!user || user.role !== 'CONDUCTOR') return of(null);
        return this.getStatsForConductor(user.uid);
      })
    );
  }

  getStatsForConductor(conductorId: string) {

    // 1️⃣ Récupérer les rides
    const ridesRef = collection(this.firestore, 'rides');
    const ridesQ = query(ridesRef, where('conductorId', '==', conductorId));

    return from(getDocs(ridesQ)).pipe(
      switchMap(ridesSnap => {
        if (ridesSnap.empty) {
          return of({
            averageRating: null,
            completedRides: 0,
            totalEarnings: 0,
          });
        }

        const rides = ridesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
        const rideIds = rides.map(r => r.id);

        // 2️⃣ Récupérer les réservations liées
        const reservationsRef = collection(this.firestore, 'reservations');
        const reservationsQ = query(reservationsRef, where('rideId', 'in', rideIds));

        return from(getDocs(reservationsQ)).pipe(
          map(reservationsSnap => {
            const reservations = reservationsSnap.docs.map(doc => doc.data() as any);

            // 3️⃣ Moyenne des ratings
            const ratings = reservations
              .map(r => r.conductorRating)
              .filter((n: number | undefined) => typeof n === 'number');

            const averageRating =
              ratings.length > 0
                ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2))
                : null;

            // 4️⃣ Rides terminés
            const completedRides = rides.filter(r => r.status === 'over').length;

            // 5️⃣ Calcul du total gagné
            const priceMap = new Map<string, number>(rides.map(r => [r.id, r.pricePerSeat]));

            let totalEarnings = 0;
            for (const res of reservations) {
              if (res.status === 'ACCEPTED') {
                const price = priceMap.get(res.rideId) ?? 0;
                totalEarnings += res.reservedPlaces * price;
              }
            }

            return {
              averageRating,
              completedRides,
              totalEarnings
            };
          })
        );
      })
    );
  }
}
