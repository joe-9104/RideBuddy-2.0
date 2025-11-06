import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isAuthenticated = false; // TODO: link later to the auth service
  user = {
    firstName: 'John',
    lastName: 'Doe',
    role: 'Passenger',
    profilePic: 'assets/passenger.svg'
  };

  logout(): void {
    // TODO: replace with the auth service logic
    console.log('Logging out...');
  }
}
