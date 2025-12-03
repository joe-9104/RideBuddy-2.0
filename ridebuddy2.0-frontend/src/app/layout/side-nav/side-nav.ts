import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {filter, map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';

export interface NavItem {
  title: string;
  icon: string;
  link: string;
  role: "CONDUCTOR" | "PASSENGER";
}

@Component({
  selector: 'app-side-nav',
  imports: [
    AsyncPipe
  ],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav implements OnInit{
  role$!: Observable<"CONDUCTOR" | "PASSENGER">;
  protected router = inject(Router);

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
      this.role$ = this.auth.user$.pipe(
          filter(user=> user != null),
          map(user=> user.role)
      )
  }

  navItems: NavItem[] = [
    // CONDUCTOR
    {
      title: 'Offer a Ride',
      icon: 'bi-car-front-fill',
      link: '/dashboard/rides/create',
      role: 'CONDUCTOR',
    },
    {
      title: 'Rides Management',
      icon: 'bi-card-checklist',
      link: '/dashboard/rides/myRides',
      role: 'CONDUCTOR',
    },
    {
      title: 'Manage Reservations',
      icon: 'bi-card-checklist',
      link: '/dashboard/reservations/manage',
      role: 'CONDUCTOR',
    },

    // PASSENGER
    {
      title: 'All Rides',
      icon: 'bi-search',
      link: '/dashboard/rides/all-rides',
      role: 'PASSENGER',
    },
    {
      title: 'My Reservations',
      icon: 'bi-bookmark-check',
      link: '/dashboard/reservations/history',
      role: 'PASSENGER',
    },
  ];

}
