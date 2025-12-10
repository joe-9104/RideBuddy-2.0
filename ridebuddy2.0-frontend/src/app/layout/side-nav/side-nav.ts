import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {filter, map, Observable} from 'rxjs';
import {AsyncPipe, NgClass} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {FontAwesomeModule, IconDefinition} from '@fortawesome/angular-fontawesome';
import {
  faBars,
  faCarSide,
  faUserCog,
  faTachometerAlt,
  faClipboardList,
  faCalendarCheck, faSearch, faBookmark
} from '@fortawesome/free-solid-svg-icons';

export interface NavItem {
  title: string;
  icon: string;
  faIcon?: IconDefinition;
  link: string;
  role: "CONDUCTOR" | "PASSENGER";
}

@Component({
  selector: 'app-side-nav',
  imports: [
    AsyncPipe,
    FontAwesomeModule,
    RouterLink,
    NgClass,
  ],
  templateUrl: './side-nav.html',
})
export class SideNav implements OnInit {
  role$!: Observable<"CONDUCTOR" | "PASSENGER">;
  protected router = inject(Router);

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.role$ = this.auth.user$.pipe(
      filter(user => user != null),
      map(user => user.role)
    );
  }

  isActiveLink(link: string): boolean {
    const current = this.router.url;
    return current === link || current.startsWith(link + '/') || (link === '/dashboard' && current.startsWith('/dashboard'));
  }

  navClasses(link: string): string[] {
    const base = 'flex items-center gap-3 px-4 py-3 rounded-xl border-l-4 border-transparent font-semibold transition-all duration-200';
    const active = this.isActiveLink(link);
    const activeStyles = 'bg-gradient-to-r from-emerald-100 via-white to-cyan-50 text-emerald-700 border-emerald-500 shadow-lg shadow-emerald-200/60 dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:text-emerald-200 dark:border-emerald-400 dark:shadow-emerald-900/40';
    const inactiveStyles = 'bg-white/80 dark:bg-slate-900/70 text-slate-600 dark:text-slate-300 hover:bg-emerald-100/70 dark:hover:bg-slate-800/80 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-200';
    return [base, active ? activeStyles : inactiveStyles];
  }

  navItems: NavItem[] = [
    {
      title: 'Offer a Ride',
      icon: 'bi-car-front-fill',
      faIcon: faCarSide,
      link: '/dashboard/rides/create',
      role: 'CONDUCTOR',
    },
    {
      title: 'Rides Management',
      icon: 'bi-card-checklist',
      faIcon: faClipboardList,
      link: '/dashboard/rides/myRides',
      role: 'CONDUCTOR',
    },
    {
      title: 'Manage Reservations',
      icon: 'bi-card-checklist',
      faIcon: faCalendarCheck,
      link: '/dashboard/reservations/manage',
      role: 'CONDUCTOR',
    },
    {
      title: 'All Rides',
      icon: 'bi-search',
      faIcon: faSearch,
      link: '/dashboard/rides/all-rides',
      role: 'PASSENGER',
    },
    {
      title: 'My Reservations',
      icon: 'bi-bookmark-check',
      faIcon: faBookmark,
      link: '/dashboard/reservations/history',
      role: 'PASSENGER',
    },
  ];

  protected readonly faBars = faBars;
  protected readonly faTachometerAlt = faTachometerAlt;
  protected readonly faUserCog = faUserCog;
}
