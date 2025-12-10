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
import { CombinedStatsService } from '../../core/services/combinedStats.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CommonModule,
    FaIconComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  combinedStatsService = inject(CombinedStatsService);

  stats$!: Observable<any>;

  user$: BehaviorSubject<User | null>;

  constructor(public auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }

  async ngOnInit() {
    // subscribe to unified stats for current user (includes conductor + passenger where available)
    this.stats$ = this.combinedStatsService.getUnifiedStats();

    // keep for backward compatibility - not used for stats selection anymore
    this.user$.subscribe();

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
