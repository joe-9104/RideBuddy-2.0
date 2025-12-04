import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import { FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faRightFromBracket, faUser, faGear } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe,
    FontAwesomeModule,
    FaIconComponent
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  user$: BehaviorSubject<User | null>;
  public menuOpen: boolean = false; // control dropdown

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

  // FontAwesome icons
  public readonly faChevronDown = faChevronDown;
  public readonly faRightFromBracket = faRightFromBracket;
  public readonly faUser = faUser;
  public readonly faGear = faGear;
}
