import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthWrapper} from './core/utils/auth-wrapper/auth-wrapper';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AuthWrapper],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ridebuddy2.0-frontend');
}
