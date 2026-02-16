import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export type DbProfile = Tables<'profiles'>;
export type DbTrip = Tables<'trips'>;
export type DbBooking = Tables<'bookings'>;

export interface TripWithDriver extends DbTrip {
  driver: DbProfile;
}

export interface BookingWithTrip extends DbBooking {
  trip: TripWithDriver;
}

export const locations = [
  'Badalabougou', 'ACI 2000', 'Magnambougou', 'Kalaban-Coro',
  'Hippodrome', 'Lafiabougou', 'Centre-ville', 'Hamdallaye', 'Sotuba',
  'Université USSGB', 'Université ULSHB', 'ENSup', 'IPR/IFRA',
  'Lycée Prosper Camara', 'Lycée Technique', 'Lycée Ba Aminata Diallo',
];

export const universities = [
  'USSGB', 'ULSHB', 'ENSup', 'IPR/IFRA', 'USJPB', 'USTTB',
  'Lycée Prosper Camara', 'Lycée Technique', 'Lycée Ba Aminata Diallo',
];

// Fetch published trips with driver profile
export async function fetchTrips(filters?: {
  from?: string;
  to?: string;
  type?: string;
}) {
  let query = supabase
    .from('trips')
    .select('*, driver:profiles!trips_driver_id_fkey(*)')
    .eq('status', 'published')
    .order('departure_date', { ascending: true });

  if (filters?.from) {
    query = query.ilike('departure_name', `%${filters.from}%`);
  }
  if (filters?.to) {
    query = query.ilike('destination_name', `%${filters.to}%`);
  }
  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as TripWithDriver[]) ?? [];
}

export async function fetchTripById(id: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, driver:profiles!trips_driver_id_fkey(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as unknown as TripWithDriver;
}

export async function createTrip(trip: Omit<DbTrip, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('trips').insert(trip).select().single();
  if (error) throw error;
  return data;
}

export async function createBooking(booking: {
  trip_id: string;
  passenger_id: string;
  seats_booked: number;
  total_price: number;
  payment_method: string;
}) {
  const { data, error } = await supabase.from('bookings').insert(booking).select().single();
  if (error) throw error;
  
  // Decrement seats_available on the trip
  const { data: tripData } = await supabase.from('trips').select('seats_available').eq('id', booking.trip_id).single();
  if (tripData) {
    await supabase.from('trips').update({ seats_available: Math.max(0, tripData.seats_available - booking.seats_booked) }).eq('id', booking.trip_id);
  }
  
  return data;
}

export async function fetchMyBookings(userId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, trip:trips(*, driver:profiles!trips_driver_id_fkey(*))')
    .eq('passenger_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as BookingWithTrip[]) ?? [];
}

export async function fetchMyTripsAsDriver(userId: string) {
  const { data, error } = await supabase
    .from('trips')
    .select('*, driver:profiles!trips_driver_id_fkey(*)')
    .eq('driver_id', userId)
    .order('departure_date', { ascending: false });
  if (error) throw error;
  return (data as unknown as TripWithDriver[]) ?? [];
}

export async function updateProfile(id: string, updates: Partial<DbProfile>) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id);
  if (error) throw error;
}
