import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe, NgIf} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
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
