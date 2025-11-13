import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-auth-wrapper',
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './auth-wrapper.html',
  styleUrl: './auth-wrapper.scss',
})
export class AuthWrapper {
  constructor(public auth: AuthService) {}
}
