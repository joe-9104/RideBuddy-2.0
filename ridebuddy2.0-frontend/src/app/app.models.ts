export interface Ride {
  id?: string; // Firestore doc id
  departureLocation: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  startGovernorate: string;
  endGovernorate: string;
  startCoordinate: string;
  endCoordinate: string;
  availablePlaces: number;
  pricePerSeat: number;
  comments: string;
  conductorId: string;
  status?: 'in-progress' | 'over' | 'canceled';
}

export interface Reservation {
  id?: string;
  createdAt: any;
  reservedPlaces: number;
  rideId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELED';
  userId: string;
  ride?: Ride | null;
  user?: {
    displayName?: string;
    email?: string;
  };
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'CONDUCTOR' | 'PASSENGER';
  completedRides?: number;
  averageRating?: number;
  totalEarnings?: number;
}

export enum Governorate {
  Tunis = 'Tunis',
  Ariana = 'Ariana',
  BenArous = 'Ben Arous',
  Manouba = 'Manouba',
  Nabeul = 'Nabeul',
  Zaghouan = 'Zaghouan',
  Bizerte = 'Bizerte',
  Beja = 'Béja',
  Jendouba = 'Jendouba',
  LeKef = 'Le Kef',
  Siliana = 'Siliana',
  Sousse = 'Sousse',
  Monastir = 'Monastir',
  Mahdia = 'Mahdia',
  Sfax = 'Sfax',
  Kairouan = 'Kairouan',
  Kasserine = 'Kasserine',
  SidiBouzid = 'Sidi Bouzid',
  Gabes = 'Gabès',
  Medenine = 'Médenine',
  Tataouine = 'Tataouine',
  Gafsa = 'Gafsa',
  Tozeur = 'Tozeur',
  Kebili = 'Kebili'
}
