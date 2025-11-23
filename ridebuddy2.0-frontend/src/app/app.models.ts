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

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'CONDUCTOR' | 'PASSENGER';
  completedRides?: number;
  averageRating?: number;
  totalEarnings?: number;
}
