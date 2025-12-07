import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FaIconComponent, IconDefinition} from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import {
  faCarSide,
  faCompass,
  faLocationDot,
  faMapMarkedAlt, faPaperPlane, faPersonBiking, faRoad, faRoute, faShieldAlt,
  faSlidersH, faTachometerAlt,
  faUserPlus,
  faWaveSquare
} from '@fortawesome/free-solid-svg-icons';

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

@Component({
  standalone: true,
  selector: 'app-landing-page',
  imports: [CommonModule, FaIconComponent, RouterLink],
  templateUrl: './landing-page.html',
})
export class LandingPage {
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
    { value: '1.8 km', label: 'Avg. Pickup Radius', icon: faMapMarkedAlt},
    { value: '842', label: 'Drivers online', icon: faPersonBiking },
    { value: '12k+', label: 'Monthly rides', icon: faRoute },
  ];

  readonly nearbyRides: NearbyRide[] = [
    {
      route: 'Kemang → SCBD',
      driver: 'Driver: Wulan',
      eta: 'ETA 4 min',
      seats: '3 seats left',
      price: 'Rp 35k',
      distance: '1.2 km away',
      vibe: 'EV — Calm AC',
      icon: faCarSide,
    },
    {
      route: 'Pondok Indah → Blok M',
      driver: 'Driver: Nabil',
      eta: 'ETA 6 min',
      seats: '2 seats left',
      price: 'Rp 28k',
      distance: '1.7 km away',
      vibe: 'Hybrid — Quiet ride',
      icon: faRoad,
    },
    {
      route: 'Cilandak → Senayan',
      driver: 'Driver: Rima',
      eta: 'ETA 5 min',
      seats: '4 seats left',
      price: 'Rp 32k',
      distance: '1.4 km away',
      vibe: 'EV — Fast lane',
      icon: faTachometerAlt,
    },
  ];

  protected readonly faWaveSquare = faWaveSquare;
  protected readonly faMapMarkedAlt = faMapMarkedAlt;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faCompass = faCompass;
  protected readonly faPaperPlane = faPaperPlane;
  protected readonly faRoute = faRoute;
}
