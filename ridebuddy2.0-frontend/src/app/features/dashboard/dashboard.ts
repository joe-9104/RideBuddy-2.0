import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../app.models';

@Component({
  selector: 'app-dashboard',
  imports: [
    NgIf,
    AsyncPipe,
    NgSwitch,
    NgSwitchCase,
    CommonModule,
    NgSwitchDefault
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
