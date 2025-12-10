import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import {
  faCarSide,
  faCompass,
  faEnvelope,
  faLocationDot,
  faMapMarkedAlt, faPaperPlane, faPersonBiking, faRoad, faRoute, faShieldAlt,
  faSlidersH, faTachometerAlt,
  faUserPlus,
  faWaveSquare
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faLinkedinIn, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';

interface FeatureCard {
  title: string;
  description: string;
  tag: string;
  icon: IconDefinition;
  accent: string[];
}

interface MetricStat {
  value: string;
  label: string;
  icon: IconDefinition;
}

interface NearbyRide {
  route: string;
  driver: string;
  eta: string;
  seats: string;
  price: string;
  distance: string;
  vibe: string;
  icon: IconDefinition;
}

interface FooterLink {
  label: string;
  path: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  icon: IconDefinition;
  url: string;
}

@Component({
  standalone: true,
  selector: 'app-landing-page',
  imports: [CommonModule, FaIconComponent, RouterLink],
  templateUrl: './landing-page.html',
})
export class LandingPage implements OnInit {
  protected isDarkMode = false;

  readonly features: FeatureCard[] = [
    {
      title: 'Nearby by design',
      description: 'Smart matching surfaces rides less than 3 km away so you are always seconds from a pickup.',
      tag: 'Live routes',
      icon: faLocationDot,
      accent: ['from-emerald-400', 'to-cyan-500'],
    },
    {
      title: 'Intentional preferences',
      description: 'Save your regular routes, seating style, and comfort cues for perfectly curated offers.',
      tag: 'Personalized',
      icon: faSlidersH,
      accent: ['from-sky-500', 'to-indigo-600'],
    },
    {
      title: 'Community secured',
      description: 'Human-verified profiles, safety checkpoints, and transparent feedback keep every mile mindful.',
      tag: 'Trust',
      icon: faShieldAlt,
      accent: ['from-amber-500', 'to-orange-600'],
    },
  ];

  readonly stats: MetricStat[] = [
    { value: '1.8 km', label: 'Avg. Pickup Radius', icon: faMapMarkedAlt },
    { value: '842', label: 'Drivers online', icon: faPersonBiking },
    { value: '12k+', label: 'Monthly rides', icon: faRoute },
  ];

  readonly nearbyRides: NearbyRide[] = [
    {
      route: 'Tunis → Monastir',
      driver: 'Driver: Youssef',
      eta: 'ETA 2h',
      seats: '3 seats left',
      price: '15 TND',
      distance: '1.2 km away',
      vibe: 'EV — Calm AC',
      icon: faCarSide,
    },
    {
      route: 'Bizerte → Béjà',
      driver: 'Driver: Nabil',
      eta: 'ETA 1h30',
      seats: '2 seats left',
      price: '10 TND',
      distance: '1.7 km away',
      vibe: 'Hybrid — Quiet ride',
      icon: faRoad,
    },
    {
      route: 'Sfax → Djerba',
      driver: 'Driver: Idris',
      eta: 'ETA 4h',
      seats: '4 seats left',
      price: '20 TND',
      distance: '1.4 km away',
      vibe: 'ICE — Fast lane',
      icon: faTachometerAlt,
    },
  ];

  readonly footerColumns: FooterColumn[] = [
    {
      heading: 'Product',
      links: [
        { label: 'Nearby rides', path: '/rides-near-me' },
        { label: 'Driver hub', path: '/register' },
        { label: 'Route rewards', path: '/dashboard' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Press', path: '/press' },
      ],
    },
    {
      heading: 'Support',
      links: [
        { label: 'Help center', path: '/help' },
        { label: 'Security', path: '/security' },
        { label: 'Feedback', path: '/contact' },
      ],
    },
  ];

  readonly footerSocials: SocialLink[] = [
    { label: 'Facebook', icon: faFacebookF, url: 'https://facebook.com' },
    { label: 'Instagram', icon: faInstagram, url: 'https://instagram.com' },
    { label: 'LinkedIn', icon: faLinkedinIn, url: 'https://linkedin.com' },
    { label: 'Twitter', icon: faTwitter, url: 'https://twitter.com' },
  ];

  ngOnInit() {
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  protected readonly currentYear = new Date().getFullYear();
  protected readonly faWaveSquare = faWaveSquare;
  protected readonly faMapMarkedAlt = faMapMarkedAlt;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faCompass = faCompass;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly faRoute = faRoute;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faMoon = faMoon;
  protected readonly faSun = faSun;
}
