import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ConductorStatsService } from './conductorStats.service';
import { PassengerStatsService } from './passengerStats.service';
import { combineLatest, map, of, switchMap } from 'rxjs';

export interface UnifiedStats {
  userId: string;
  conductor?: {
    averageRating: number | null;
    completedRides: number;
    totalEarnings: number;
    earnedPerRide?: number | null;
    ridesCreated?: number;
  } | null;
  passenger?: {
    totalReservations: number;
    acceptedReservations: number;
    ridesTaken: number;
    acceptanceRate?: number | null;
  } | null;
  shared?: {
    totalActivityCount: number;
    lastUpdated?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class CombinedStatsService {
  constructor(
    private auth: AuthService,
    private conductorStats: ConductorStatsService,
    private passengerStats: PassengerStatsService
  ) {}

  /**
   * Returns an observable that emits a unified stats object for the current user.
   * It will try to fetch both conductor and passenger stats for the authenticated uid.
   */
  getUnifiedStats() {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) return of(null);
        const uid = user.uid;

        const conductor$ = this.conductorStats.getStatsForConductor
          ? this.conductorStats.getStatsForConductor(uid)
          : of(null as any);

        const passenger$ = this.passengerStats.getStatsForPassenger
          ? this.passengerStats.getStatsForPassenger(uid)
          : of(null as any);

        return combineLatest([conductor$, passenger$]).pipe(
          map(([conductorRes, passengerRes]) => {
            const conductor = conductorRes
              ? {
                  averageRating: conductorRes.averageRating ?? null,
                  completedRides: conductorRes.completedRides ?? 0,
                  totalEarnings: conductorRes.totalEarnings ?? 0,
                  earnedPerRide:
                    conductorRes.completedRides && conductorRes.completedRides > 0
                      ? Number((conductorRes.totalEarnings / conductorRes.completedRides).toFixed(2))
                      : null,
                  ridesCreated: conductorRes.ridesCreated ?? undefined
                }
              : null;

            const passenger = passengerRes
              ? {
                  totalReservations: passengerRes.totalReservations ?? 0,
                  acceptedReservations: passengerRes.acceptedReservations ?? 0,
                  ridesTaken: passengerRes.ridesTaken ?? 0,
                  acceptanceRate:
                    passengerRes.totalReservations && passengerRes.totalReservations > 0
                      ? Number((passengerRes.acceptedReservations / passengerRes.totalReservations).toFixed(2))
                      : null
                }
              : null;

            const totalActivityCount = (conductor?.completedRides ?? 0) + (passenger?.ridesTaken ?? 0);

            const shared = {
              totalActivityCount,
              lastUpdated: new Date().toISOString()
            };

            return {
              userId: uid,
              conductor,
              passenger,
              shared
            } as UnifiedStats;
          })
        );
      })
    );
  }
}

