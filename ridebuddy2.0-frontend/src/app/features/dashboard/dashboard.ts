import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
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
export class Dashboard {
  user$: BehaviorSubject<User | null>;
  constructor(public auth: AuthService) {
    this.user$ = this.auth.userSubject;
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
