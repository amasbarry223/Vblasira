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

export const quartiers = [
  'ACI 2000', 'Badalabougou', 'Badialan', 'Baco-Djicoroni', 'Banconi',
  'Bolibana', 'Centre-ville', 'Daoudabougou', 'Djélibougou', 'Dravéla',
  'Faladiè', 'Garantiguibougou', 'Hamdallaye', 'Hippodrome',
  'Kalaban-Coro', 'Kalabancoro', 'Korofina', 'Lafiabougou',
  'Magnambougou', 'Missabougou', 'Missira', 'Moribabougou',
  'Niamakoro', 'Niarela', 'N\'Tomikorobougou', 'Ouolofobougou',
  'Point-G', 'Quinzambougou', 'Sabalibougou', 'Samé', 'Sébenikoro',
  'Sikoroni', 'Sogoniko', 'Sotuba', 'Titibougou', 'Torokorobougou',
  'Yirimadio',
];

export const universities = [
  'Université des Sciences Sociales et de Gestion de Bamako (USSGB)',
  'Université des Lettres et des Sciences Humaines de Bamako (ULSHB)',
  'Université des Sciences, des Techniques et des Technologies de Bamako (USTTB)',
  'Université des Sciences Juridiques et Politiques de Bamako (USJPB)',
  'École Normale Supérieure (ENSup)',
  'Institut Polytechnique Rural / Institut de Formation et de Recherche Appliquée (IPR/IFRA)',
  'École Nationale d\'Ingénieurs Abderhamane Baba Touré (ENI-ABT)',
  'Institut Universitaire de Gestion (IUG)',
  'Faculté de Médecine et d\'Odontostomatologie (FMOS)',
  'Faculté de Pharmacie (FAPH)',
  'Institut des Sciences Appliquées (ISA)',
  'Institut Supérieur de Formation et de Recherche Appliquée (ISFRA)',
  'Lycée Prosper Camara',
  'Lycée Technique de Bamako',
  'Lycée Ba Aminata Diallo',
  'Lycée Askia Mohamed',
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
