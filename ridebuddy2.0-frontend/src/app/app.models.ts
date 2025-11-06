export interface Ride {
  id?: string;
  driverId: string;
  from: string;
  to: string;
  seatsAvailable: number;
  createdAt?: any;
}
