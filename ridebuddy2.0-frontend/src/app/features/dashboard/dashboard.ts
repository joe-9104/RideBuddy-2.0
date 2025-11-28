import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  user$: BehaviorSubject<User | null>;
  constructor(public auth: AuthService) {
    this.user$ = this.auth.userSubject;
  }
}
