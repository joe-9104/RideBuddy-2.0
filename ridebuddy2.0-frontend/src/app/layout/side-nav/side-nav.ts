import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {filter, map, Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Router} from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export interface NavItem {
  title: string;
  icon: string;
  faIcon?: [string, string] | string[]; // allow tuple or array accepted by fa-icon
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

  // Helpers for template
  getFaIcon(item: NavItem): [string,string] {
    // use any cast to avoid strict template type issues
    const fa = (item as any).faIcon;
    if (Array.isArray(fa) && fa.length === 2) return fa as [string,string];
    // fallback mapping based on bootstrap-like icon names
    const map: Record<string,[string,string]> = {
      'bi-car-front-fill': ['fas','car-side'],
      'bi-card-checklist': ['fas','clipboard-list'],
      'bi-search': ['fas','search'],
      'bi-bookmark-check': ['fas','bookmark']
    };
    return map[item.icon] ?? ['fas','circle'];
  }

  navItems: NavItem[] = [
    // CONDUCTOR
    {
      title: 'Offer a Ride',
      icon: 'bi-car-front-fill',
      faIcon: ['fas','car-side'],
      link: '/dashboard/rides/create',
      role: 'CONDUCTOR',
    },
    {
      title: 'Rides Management',
      icon: 'bi-card-checklist',
      faIcon: ['fas','clipboard-list'],
      link: '/dashboard/rides/myRides',
      role: 'CONDUCTOR',
    },
    {
      title: 'Manage Reservations',
      icon: 'bi-card-checklist',
      faIcon: ['fas','calendar-check'],
      link: '/dashboard/reservations/manage',
      role: 'CONDUCTOR',
    },

    // PASSENGER
    {
      title: 'All Rides',
      icon: 'bi-search',
      faIcon: ['fas','search'],
      link: '/dashboard/rides/all-rides',
      role: 'PASSENGER',
    },
    {
      title: 'My Reservations',
      icon: 'bi-bookmark-check',
      faIcon: ['fas','bookmark'],
      link: '/dashboard/reservations/history',
      role: 'PASSENGER',
    },
  ];

}
