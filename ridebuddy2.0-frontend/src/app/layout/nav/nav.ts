import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    AsyncPipe,
    NgIf,
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
}
