import { Routes } from '@angular/router';
import {LandingPage} from './features/auth/landing-page/landing-page';
import {Dashboard} from './features/dashboard/dashboard';
import {authGuard} from './core/guards/auth.guard';
import {CreateRide} from './features/rides/create-ride/create-ride';
import {RidesListConductor} from './features/rides/rides-list-conductor/rides-list-conductor';
import {RidesListPassenger} from './features/rides-list-passenger/rides-list-passenger';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login)},
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  { path: 'rides/create', component: CreateRide, canActivate: [authGuard] },
  { path: 'rides/myRides', component: RidesListConductor, canActivate: [authGuard] },
  { path: 'rides/all-rides', component: RidesListPassenger, canActivate: [authGuard] },
  { path: '**', redirectTo: '/dashboard'},
];
