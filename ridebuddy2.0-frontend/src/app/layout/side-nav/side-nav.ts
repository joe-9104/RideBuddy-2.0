import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {filter, map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';
import {FontAwesomeModule, IconDefinition} from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faBookmark,
  faCalendarCheck,
  faCarSide,
  faClipboardList,
  faSearch, faTachometerAlt,
  faUserCog
} from '@fortawesome/free-solid-svg-icons';

export interface NavItem {
  title: string;
  faIcon?: IconDefinition
  link: string;
  role: "CONDUCTOR" | "PASSENGER";
}

@Component({
  selector: 'app-side-nav',
  imports: [
    AsyncPipe,
    FontAwesomeModule
  ],
  templateUrl: './side-nav.html',
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
      faIcon: faCarSide,
      link: '/dashboard/rides/create',
      role: 'CONDUCTOR',
    },
    {
      title: 'Rides Management',
      faIcon: faClipboardList,
      link: '/dashboard/rides/myRides',
      role: 'CONDUCTOR',
    },
    {
      title: 'Manage Reservations',
      faIcon: faCalendarCheck,
      link: '/dashboard/reservations/manage',
      role: 'CONDUCTOR',
    },

    // PASSENGER
    {
      title: 'All Rides',
      faIcon: faSearch,
      link: '/dashboard/rides/all-rides',
      role: 'PASSENGER',
    },
    {
      title: 'My Reservations',
      faIcon: faBookmark,
      link: '/dashboard/reservations/history',
      role: 'PASSENGER',
    },
  ];

  protected readonly faUserCog = faUserCog;
  protected readonly faTachometerAlt = faTachometerAlt;
  protected readonly faBars = faBars;
}
