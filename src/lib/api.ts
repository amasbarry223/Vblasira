import type { User, Trip, Booking } from '@/lib/mock-data';
import {
  mockTrips,
  mockDrivers,
  mockBookings,
  quartiers,
  universities,
} from '@/lib/mock-data';

export type DbProfile = User;
export type DbTrip = Trip;
export type DbBooking = Booking;

export interface TripWithDriver extends Trip {
  driver: User;
}

export interface BookingWithTrip extends Booking {
  trip: TripWithDriver;
}

export { quartiers, universities };

// Store en mémoire pour les données créées en session
const createdTrips: TripWithDriver[] = [];
const createdBookings: (BookingWithTrip & { passenger_id: string })[] = [];
const profilesById = new Map<string, User>();

// Initialiser avec les mock drivers pour résoudre driver_id
mockDrivers.forEach((d) => profilesById.set(d.id, d));

function getDriverById(id: string): User | undefined {
  return profilesById.get(id) ?? mockDrivers.find((d) => d.id === id);
}

function ensureTripWithDriver(t: Trip): TripWithDriver {
  const driver = getDriverById(t.driver_id);
  if (!driver) return { ...t, driver: mockDrivers[0] };
  return { ...t, driver };
}

export function registerProfile(id: string, profile: User): void {
  profilesById.set(id, profile);
}

// Fetch published trips with optional filters
export async function fetchTrips(filters?: {
  from?: string;
  to?: string;
  type?: string;
}): Promise<TripWithDriver[]> {
  await new Promise((r) => setTimeout(r, 100));
  const all = [...mockTrips, ...createdTrips]
    .filter((t) => t.status === 'published')
    .map(ensureTripWithDriver)
    .sort(
      (a, b) =>
        new Date(a.departure_date).getTime() -
        new Date(b.departure_date).getTime()
    );

  let result = all;
  if (filters?.from) {
    const lower = filters.from.toLowerCase();
    result = result.filter((t) =>
      t.departure_name.toLowerCase().includes(lower)
    );
  }
  if (filters?.to) {
    const lower = filters.to.toLowerCase();
    result = result.filter((t) =>
      t.destination_name.toLowerCase().includes(lower)
    );
  }
  if (filters?.type && filters.type !== 'all') {
    result = result.filter((t) => t.type === filters!.type);
  }
  return result;
}

export async function fetchTripById(id: string): Promise<TripWithDriver> {
  await new Promise((r) => setTimeout(r, 50));
  const trip =
    mockTrips.find((t) => t.id === id) ?? createdTrips.find((t) => t.id === id);
  if (!trip) throw new Error('Trajet introuvable');
  return ensureTripWithDriver(trip);
}

export async function createTrip(
  trip: Omit<DbTrip, 'id' | 'driver'>
): Promise<TripWithDriver> {
  await new Promise((r) => setTimeout(r, 150));
  const id = `created-${Date.now()}`;
  const driver = getDriverById(trip.driver_id);
  const newTrip: TripWithDriver = {
    ...trip,
    id,
    driver: driver ?? mockDrivers[0],
  };
  createdTrips.push(newTrip);
  return newTrip;
}

export async function createBooking(booking: {
  trip_id: string;
  passenger_id: string;
  seats_booked: number;
  total_price: number;
  payment_method: string;
}): Promise<BookingWithTrip> {
  await new Promise((r) => setTimeout(r, 150));
  const trip =
    mockTrips.find((t) => t.id === booking.trip_id) ??
    createdTrips.find((t) => t.id === booking.trip_id);
  if (!trip) throw new Error('Trajet introuvable');
  const tripWithDriver = ensureTripWithDriver(trip);
  tripWithDriver.seats_available = Math.max(
    0,
    tripWithDriver.seats_available - booking.seats_booked
  );
  const id = `booking-${Date.now()}`;
  const bookingWithTrip: BookingWithTrip & { passenger_id: string } = {
    id,
    trip: tripWithDriver,
    seats_booked: booking.seats_booked,
    total_price: booking.total_price,
    status: 'confirmed',
    payment_method: booking.payment_method as 'orange_money' | 'moov_money' | 'cash',
    passenger_id: booking.passenger_id,
  };
  createdBookings.push(bookingWithTrip);
  return bookingWithTrip;
}

export async function fetchMyBookings(
  userId: string
): Promise<BookingWithTrip[]> {
  await new Promise((r) => setTimeout(r, 80));
  const mine = createdBookings
    .filter((b) => b.passenger_id === userId)
    .map(({ passenger_id: _p, ...b }) => b);
  const withTrip = mockBookings.map((b) => ({
    ...b,
    trip: ensureTripWithDriver(b.trip),
  })) as BookingWithTrip[];
  return [...mine, ...withTrip].sort(
    (a, b) =>
      new Date(b.trip.departure_date).getTime() -
      new Date(a.trip.departure_date).getTime()
  );
}

export async function fetchMyTripsAsDriver(
  userId: string
): Promise<TripWithDriver[]> {
  await new Promise((r) => setTimeout(r, 80));
  const all = [...mockTrips, ...createdTrips];
  return all
    .filter((t) => t.driver_id === userId)
    .map(ensureTripWithDriver)
    .sort(
      (a, b) =>
        new Date(b.departure_date).getTime() -
        new Date(a.departure_date).getTime()
    );
}

export async function updateProfile(
  id: string,
  updates: Partial<DbProfile>
): Promise<void> {
  await new Promise((r) => setTimeout(r, 50));
  const existing = profilesById.get(id);
  if (existing) {
    profilesById.set(id, { ...existing, ...updates });
  }
}
