import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faBell, faEnvelope, faGear, faUser, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  imports: [
    AsyncPipe,
    RouterLink,
    FaIconComponent,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  user$: BehaviorSubject<User | null>;
  public menuOpen: boolean = false;
  public isDarkMode: boolean = false;

  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.userSubject;
  }

  ngOnInit() {
    // Check initial dark mode state
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout() {
    this.auth.logout()
      .then(() => this.router.navigate(["/login"]))
      .catch((err) => console.error(err));
  }

  protected readonly faEnvelope = faEnvelope;
  protected readonly faBell = faBell;
  protected readonly faGear = faGear;
  protected readonly faUser = faUser;
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
}
