import { Routes } from '@angular/router';
import {LandingPage} from './features/auth/landing-page/landing-page';
import {Dashboard} from './features/dashboard/dashboard';
import {AuthGuard} from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingPage },
  { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login)},
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.Register)},
  { path: 'contact' , loadComponent: () => import('./features/contact/contact').then(m => m.Contact)},
  { path: '**', redirectTo: ''},
];
