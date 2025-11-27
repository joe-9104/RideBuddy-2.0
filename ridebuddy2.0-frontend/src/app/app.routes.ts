import { Routes } from '@angular/router';
import {LandingPage} from './features/auth/landing-page/landing-page';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';
import {landingGuard} from './core/guards/landing-guard';
import {CreateRide} from './features/rides/create-ride/create-ride';
import {RidesListConductor} from './features/rides/rides-list-conductor/rides-list-conductor';
import {RidesListPassenger} from './features/rides/rides-list-passenger/rides-list-passenger';
import {
  PassengerReservationsHistory
} from './features/reservations/passenger-reservations-history/passenger-reservations-history';
import {RideVisualize} from './features/rides/ride-visualize/ride-visualize';
import {Layout} from './layout/layout';

export const routes: Routes = [
  { path: '', component: LandingPage, canActivate: [landingGuard] },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login)},
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  { path: 'dashboard', component: Layout, canActivate: [authGuard], children: [
      { path: '', component: Dashboard },
      // CONDUCTOR
      { path: 'rides/create', component: CreateRide },
      { path: 'rides/myRides', component: RidesListConductor },
      { path: 'rides/ride-visualize/:id', component: RideVisualize },
      // PASSENGER
      { path: 'rides/all-rides', component: RidesListPassenger },
      { path: 'reservations/history', component: PassengerReservationsHistory },
    ]
  },
  { path: '**', redirectTo: '/'},
];
