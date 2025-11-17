import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule, NgIf} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';
import {Navbar} from '../../shared/navbar/navbar';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIf,
    AsyncPipe,
    CommonModule,
    Navbar,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  user$: BehaviorSubject<User | null>;
  constructor(public auth: AuthService) {
    this.user$ = this.auth.user$;
  }
}
