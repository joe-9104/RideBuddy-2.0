import { Component } from '@angular/core';
import {Nav} from './nav/nav';
import {SideNav} from './side-nav/side-nav';
import {RouterOutlet} from '@angular/router';
import {Footer} from './footer/footer';

@Component({
  selector: 'app-layout',
  imports: [
    Nav,
    SideNav,
    RouterOutlet,
    Footer,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {

}
