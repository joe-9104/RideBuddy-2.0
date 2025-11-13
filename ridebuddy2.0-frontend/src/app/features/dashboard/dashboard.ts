import { Component } from '@angular/core';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe, CommonModule, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

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
  constructor(public auth: AuthService) {
    console.log(auth);
  }
}
