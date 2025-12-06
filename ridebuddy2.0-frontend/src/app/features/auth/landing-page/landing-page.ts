import { Component } from '@angular/core';
import {Navbar} from '../../../shared/navbar/navbar';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-landing-page',
  imports: [
    Navbar,
    FaIconComponent
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
