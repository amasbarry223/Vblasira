export interface User {
  id: string;
  phone: string;
  name: string;
  avatar_url?: string;
  role: 'student' | 'driver_moto' | 'driver_car';
  university?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  rating: number;
  total_trips: number;
}

export interface Trip {
  id: string;
  driver_id: string;
  driver: User;
  type: 'voiture' | 'moto';
  departure_name: string;
  destination_name: string;
  departure_date: string;
  departure_time: string;
  seats_available: number;
  seats_total: number;
  price_per_seat: number;
  duration_min: number;
  distance_km: number;
  recurrent?: 'daily' | 'weekly' | null;
  status: 'published' | 'full' | 'completed' | 'cancelled';
  helmet_provided?: boolean;
  vehicle_info?: string;
}

export interface Booking {
  id: string;
  trip: Trip;
  seats_booked: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_method: 'orange_money' | 'moov_money' | 'cash';
}

export const mockDrivers: User[] = [
  {
    id: '1',
    phone: '+223 76 12 34 56',
    name: 'Ibrahim Keïta',
    avatar_url: 'https://i.pravatar.cc/150?img=11',
    role: 'driver_moto',
    university: 'USSGB',
    verification_status: 'verified',
    rating: 4.8,
    total_trips: 124,
  },
  {
    id: '2',
    phone: '+223 66 98 76 54',
    name: 'Moussa Diallo',
    avatar_url: 'https://i.pravatar.cc/150?img=12',
    role: 'driver_car',
    university: 'ULSHB',
    verification_status: 'verified',
    rating: 4.6,
    total_trips: 89,
  },
  {
    id: '3',
    phone: '+223 79 45 67 89',
    name: 'Aminata Traoré',
    avatar_url: 'https://i.pravatar.cc/150?img=5',
    role: 'driver_car',
    university: 'ENSup',
    verification_status: 'verified',
    rating: 4.9,
    total_trips: 56,
  },
  {
    id: '4',
    phone: '+223 69 11 22 33',
    name: 'Oumar Coulibaly',
    avatar_url: 'https://i.pravatar.cc/150?img=15',
    role: 'driver_moto',
    university: 'IPR/IFRA',
    verification_status: 'verified',
    rating: 4.7,
    total_trips: 201,
  },
];

export const mockTrips: Trip[] = [
  {
    id: '1',
    driver_id: '1',
    driver: mockDrivers[0],
    type: 'moto',
    departure_name: 'Badalabougou',
    destination_name: 'Université USSGB',
    departure_date: '2026-02-17',
    departure_time: '07:30',
    seats_available: 1,
    seats_total: 2,
    price_per_seat: 400,
    duration_min: 25,
    distance_km: 10,
    status: 'published',
    helmet_provided: true,
    vehicle_info: 'Honda 125cc',
  },
  {
    id: '2',
    driver_id: '2',
    driver: mockDrivers[1],
    type: 'voiture',
    departure_name: 'Kalaban-Coro',
    destination_name: 'Centre-ville',
    departure_date: '2026-02-17',
    departure_time: '07:00',
    seats_available: 3,
    seats_total: 4,
    price_per_seat: 500,
    duration_min: 35,
    distance_km: 14,
    status: 'published',
    vehicle_info: 'Toyota Corolla',
  },
  {
    id: '3',
    driver_id: '3',
    driver: mockDrivers[2],
    type: 'voiture',
    departure_name: 'ACI 2000',
    destination_name: 'Université ULSHB',
    departure_date: '2026-02-17',
    departure_time: '08:00',
    seats_available: 2,
    seats_total: 4,
    price_per_seat: 600,
    duration_min: 30,
    distance_km: 12,
    status: 'published',
    vehicle_info: 'Renault Logan',
  },
  {
    id: '4',
    driver_id: '4',
    driver: mockDrivers[3],
    type: 'moto',
    departure_name: 'Magnambougou',
    destination_name: 'Hippodrome',
    departure_date: '2026-02-17',
    departure_time: '07:15',
    seats_available: 2,
    seats_total: 2,
    price_per_seat: 300,
    duration_min: 20,
    distance_km: 8,
    status: 'published',
    helmet_provided: true,
    vehicle_info: 'Yamaha YBR',
  },
  {
    id: '5',
    driver_id: '1',
    driver: mockDrivers[0],
    type: 'moto',
    departure_name: 'ACI 2000',
    destination_name: 'USSGB',
    departure_date: '2026-02-18',
    departure_time: '07:30',
    seats_available: 2,
    seats_total: 2,
    price_per_seat: 500,
    duration_min: 25,
    distance_km: 10,
    status: 'published',
    helmet_provided: true,
    vehicle_info: 'Honda 125cc',
  },
  {
    id: '6',
    driver_id: '2',
    driver: mockDrivers[1],
    type: 'voiture',
    departure_name: 'Lafiabougou',
    destination_name: 'ENSup',
    departure_date: '2026-02-18',
    departure_time: '08:15',
    seats_available: 4,
    seats_total: 4,
    price_per_seat: 450,
    duration_min: 25,
    distance_km: 9,
    status: 'published',
    vehicle_info: 'Toyota Corolla',
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    trip: mockTrips[0],
    seats_booked: 1,
    total_price: 400,
    status: 'confirmed',
    payment_method: 'cash',
  },
  {
    id: '2',
    trip: { ...mockTrips[1], status: 'completed', departure_date: '2026-02-10' },
    seats_booked: 1,
    total_price: 500,
    status: 'completed',
    payment_method: 'orange_money',
  },
];

export const locations = [
  'Badalabougou',
  'ACI 2000',
  'Magnambougou',
  'Kalaban-Coro',
  'Hippodrome',
  'Lafiabougou',
  'Centre-ville',
  'Hamdallaye',
  'Sotuba',
  'Université USSGB',
  'Université ULSHB',
  'ENSup',
  'IPR/IFRA',
  'Lycée Prosper Camara',
  'Lycée Technique',
  'Lycée Ba Aminata Diallo',
];

export const universities = [
  'USSGB',
  'ULSHB',
  'ENSup',
  'IPR/IFRA',
  'USJPB',
  'USTTB',
  'Lycée Prosper Camara',
  'Lycée Technique',
  'Lycée Ba Aminata Diallo',
];
