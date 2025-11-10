export interface Ride {
  id?: string;
  driverId: string;
  from: string;
  to: string;
  seatsAvailable: number;
  createdAt?: any;
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
