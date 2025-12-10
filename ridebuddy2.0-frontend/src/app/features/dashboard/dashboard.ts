import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../app.models';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faBookBookmark,
  faCalendarCheck,
  faCarSide,
  faGaugeHigh,
  faGear, faLocationDot, faMinus,
  faMoneyBill1Wave, faPlus,
  faPlusCircle, faSearch,
  faStarHalfStroke
} from '@fortawesome/free-solid-svg-icons';
import {ConductorStatsService} from '../../core/services/conductorStats.service';
import {PassengerStatsService} from '../../core/services/passengerStats.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CommonModule,
    FaIconComponent,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  conductorStatsService = inject(ConductorStatsService);
  passengerStatsService = inject(PassengerStatsService);

  stats$!: Observable<any>;

  user$: BehaviorSubject<User | null>;

  constructor(public auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }

  async ngOnInit() {
    this.user$.subscribe(user => {
      if(user?.role === 'CONDUCTOR') this.stats$ = this.conductorStatsService.getConductorStats();
      else if (user?.role === 'PASSENGER') this.stats$ = this.passengerStatsService.getPassengerStats();
    })

  }

  protected readonly faGear = faGear;
  protected readonly faMoneyBill1Wave = faMoneyBill1Wave;
  protected readonly faStarHalfStroke = faStarHalfStroke;
  protected readonly faCarSide = faCarSide;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faGaugeHigh = faGaugeHigh;
  protected readonly faCalendarCheck = faCalendarCheck;
  protected readonly faPlus = faPlus;
  protected readonly faMinus = faMinus;
  protected readonly faBookBookmark = faBookBookmark;
  protected readonly faLocationDot = faLocationDot;
  protected readonly faSearch = faSearch;
}
