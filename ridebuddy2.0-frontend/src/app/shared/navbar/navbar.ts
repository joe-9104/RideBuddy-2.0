import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
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
  constructor(public auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }

  logout(): void {
    this.auth.logout();
  }
}
