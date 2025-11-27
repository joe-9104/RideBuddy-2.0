import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [
    AsyncPipe,
  ],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class Nav {
  user$: BehaviorSubject<User | null>;
  constructor(private auth: AuthService, private router: Router) {
    this.user$ = this.auth.userSubject;
  }

  logout() {
    this.auth.logout()
      .then(() => this.router.navigate(["/login"]))
      .catch((err) => console.error(err));
  }
}
