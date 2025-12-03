import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import {
  faUserCircle,
  faSpellCheck,
  faSync,
  faShield,
  faBell,
  faQuestionCircle,
  faChartLine,
  faExclamationTriangle,
  faBolt,
  faCheck,
  faCarSide,
  faGaugeHigh,
  faMoneyBill1Wave,
  faStarHalfStroke,
  faCalendarCheck,
  faSearch,
  faLocationDot,
  faBookBookmark,
  faPlus,
  faMinus
} from '@fortawesome/free-solid-svg-icons';
import {AsyncPipe, UpperCasePipe} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  imports: [
    UpperCasePipe,
    AsyncPipe,
    FaIconComponent
  ],
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  user$: BehaviorSubject<User | null>;

  // Icônes
  faUserCircle = faUserCircle;
  faShieldCheck = faSpellCheck;
  faSync = faSync;
  faShield = faShield;
  faBell = faBell;
  faQuestionCircle = faQuestionCircle;
  faChartLine = faChartLine;
  faExclamationTriangle = faExclamationTriangle;
  faBolt = faBolt;
  faCheck = faCheck;
  faCarSide = faCarSide;
  faGaugeHigh = faGaugeHigh;
  faMoneyBill1Wave = faMoneyBill1Wave;
  faStarHalfStroke = faStarHalfStroke;
  faCalendarCheck = faCalendarCheck;
  faSearch = faSearch;
  faLocationDot = faLocationDot;
  faBookBookmark = faBookBookmark;
  faPlus = faPlus;
  faMinus = faMinus;

  constructor(private auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }

  getRoleIcon() {
    const role = this.user$.value?.role;
    if (role === 'CONDUCTOR') {
      return faCarSide;
    } else if (role === 'PASSENGER') {
      return faUserCircle;
    }
    return faUserCircle;
  }
}
