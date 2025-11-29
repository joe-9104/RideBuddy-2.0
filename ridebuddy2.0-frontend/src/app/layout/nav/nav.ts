import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBell, faCoffee, faEnvelope, faGear, faUser} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  imports: [
    AsyncPipe,
    NgIf,
    RouterLink,
    FaIconComponent,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  user$: BehaviorSubject<User | null>;
  public menuOpen: boolean = false;
  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.userSubject;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout()
      .then(() => this.router.navigate(["/login"]))
      .catch((err) => console.error(err));
  }

  protected readonly faCoffee = faCoffee;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faBell = faBell;
  protected readonly faGear = faGear;
  protected readonly faUser = faUser;
}
